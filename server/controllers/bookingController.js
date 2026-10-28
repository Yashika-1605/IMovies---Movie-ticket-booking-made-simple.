const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Show = require('../models/Show');

/**
 * Generate a clean cinema booking reference
 * e.g., IMV-2026-X9B2K
 */
const generateBookingId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `IMV-${new Date().getFullYear()}-${code}`;
};

// @desc    Create new booking with mock payment processing
// @route   POST /api/bookings
// @access  Protected (Customer)
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seatIds, paymentMethod, couponCode } = req.body;
    const userId = req.user._id;

    if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and at least one seat to book.',
      });
    }

    const show = await Show.findById(showId).populate('movie theatre');
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // Fetch seats to book
    const seats = await Seat.find({ _id: { $in: seatIds }, show: showId });

    if (seats.length !== seatIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some of the selected seats were not found.',
      });
    }

    // Verify none are already booked
    const alreadyBooked = seats.filter((s) => s.status === 'booked');
    if (alreadyBooked.length > 0) {
      const names = alreadyBooked.map((s) => s.seatNumber).join(', ');
      return res.status(409).json({
        success: false,
        message: `Seats (${names}) are already booked. Please choose other seats.`,
      });
    }

    // Calculate subtotal
    const selectedSeats = seats.map((seat) => ({
      seatId: seat._id,
      seatNumber: seat.seatNumber,
      tier: seat.tier,
      price: seat.price,
    }));

    const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const convenienceFee = 2.5; // Flat booking fee

    // Optional promotional discount
    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === 'IMOVIES20') {
      discount = parseFloat((subtotal * 0.2).toFixed(2)); // 20% discount
    }

    const totalAmount = parseFloat((subtotal + convenienceFee - discount).toFixed(2));

    // Create booking record
    const booking = await Booking.create({
      bookingId: generateBookingId(),
      user: userId,
      show: showId,
      selectedSeats,
      subtotal,
      convenienceFee,
      discount,
      totalAmount,
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'Credit Card',
      bookingStatus: 'confirmed',
    });

    // Mark seats as 'booked'
    await Seat.updateMany(
      { _id: { $in: seatIds }, show: showId },
      {
        $set: {
          status: 'booked',
          lockedBy: userId,
          lockedUntil: null,
        },
      }
    );

    // Update show availableSeatsCount
    await Show.findByIdAndUpdate(showId, {
      $inc: { availableSeatsCount: -seatIds.length },
    });

    // Notify all clients in the show room via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(`show_${showId}`).emit('seat:booked', {
        seatIds,
        seatNumbers: seats.map((s) => s.seatNumber),
        bookingId: booking.bookingId,
      });
    }

    // Populate booking details for response
    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'show',
      populate: ['movie', 'theatre'],
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully!',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's booking history
// @route   GET /api/bookings/my-bookings
// @access  Protected
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'show',
        populate: ['movie', 'theatre'],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID or Reference
// @route   GET /api/bookings/:id
// @access  Protected
exports.getBookingById = async (req, res, next) => {
  try {
    const query = req.params.id.startsWith('IMV-')
      ? { bookingId: req.params.id }
      : { _id: req.params.id };

    const booking = await Booking.findOne(query)
      .populate('user', 'name email phone')
      .populate({
        path: 'show',
        populate: ['movie', 'theatre'],
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Security check: Only the booking owner or an admin can view
    if (
      req.user.role !== 'admin' &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking.',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking & release seats
// @route   POST /api/bookings/:id/cancel
// @access  Protected
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('show');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership or admin
    if (
      req.user.role !== 'admin' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.',
      });
    }

    // Release seats
    const seatIds = booking.selectedSeats.map((s) => s.seatId);
    await Seat.updateMany(
      { _id: { $in: seatIds } },
      {
        $set: {
          status: 'available',
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    // Increment show available seats
    await Show.findByIdAndUpdate(booking.show._id, {
      $inc: { availableSeatsCount: seatIds.length },
    });

    // Calculate 90% refund (minus cancellation fee)
    const refundAmount = parseFloat((booking.totalAmount * 0.9).toFixed(2));

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    booking.refundAmount = refundAmount;
    booking.cancelledAt = new Date();
    await booking.save();

    // Broadcast seat release to show room
    const io = req.app.get('io');
    if (io) {
      for (const seat of booking.selectedSeats) {
        io.to(`show_${booking.show._id}`).emit('seat:unlocked', {
          seatId: seat.seatId,
          seatNumber: seat.seatNumber,
          reason: 'Booking cancelled',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Booking cancelled successfully. Refund of $${refundAmount} has been processed.`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
