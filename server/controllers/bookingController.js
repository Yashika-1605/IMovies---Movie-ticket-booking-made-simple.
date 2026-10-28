const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Show = require('../models/Show');
const mockStore = require('../config/mockStore');

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
    const userId = req.user ? (req.user._id || req.user.id) : 'demo-user-id';

    if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and at least one seat to book.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const show = mockStore.shows.find((s) => s._id === showId) || mockStore.shows[0];
      const seats = mockStore.getSeats(showId);
      const bookedSeats = [];

      seatIds.forEach((id) => {
        const s = seats.find((seat) => seat._id === id || seat.seatNumber === id);
        if (s) {
          s.status = 'booked';
          bookedSeats.push({
            seatId: s._id,
            seatNumber: s.seatNumber,
            tier: s.tier,
            price: s.price,
          });
        }
      });

      const subtotal = bookedSeats.reduce((sum, s) => sum + s.price, 0);
      const convenienceFee = 2.5;
      const discount = couponCode && couponCode.toUpperCase() === 'IMOVIES20' ? parseFloat((subtotal * 0.2).toFixed(2)) : 0;
      const totalAmount = parseFloat((subtotal + convenienceFee - discount).toFixed(2));

      const newBooking = {
        _id: '66a5' + Math.random().toString(36).substring(2, 22),
        bookingId: generateBookingId(),
        user: userId,
        show: {
          ...show,
          movie: show.movieObj || mockStore.movies[0],
          theatre: show.theatreObj || mockStore.theatres[0],
        },
        selectedSeats: bookedSeats,
        subtotal,
        convenienceFee,
        discount,
        totalAmount,
        paymentStatus: 'completed',
        paymentMethod: paymentMethod || 'Credit Card',
        bookingStatus: 'confirmed',
        createdAt: new Date().toISOString(),
      };

      mockStore.bookings.unshift(newBooking);

      const io = req.app.get('io');
      if (io) {
        io.to(`show_${showId}`).emit('seat:booked', {
          seatIds,
          seatNumbers: bookedSeats.map((s) => s.seatNumber),
          bookingId: newBooking.bookingId,
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully!',
        data: newBooking,
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
    const convenienceFee = 2.5;

    let discount = 0;
    if (couponCode && couponCode.toUpperCase() === 'IMOVIES20') {
      discount = parseFloat((subtotal * 0.2).toFixed(2));
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
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: mockStore.bookings.length,
        data: mockStore.bookings,
      });
    }

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
    if (mongoose.connection.readyState !== 1) {
      const booking =
        mockStore.bookings.find(
          (b) => b._id === req.params.id || b.bookingId === req.params.id
        ) || mockStore.bookings[0];

      return res.status(200).json({
        success: true,
        data: booking,
      });
    }

    const booking = await Booking.findOne({
      $or: [{ _id: req.params.id }, { bookingId: req.params.id }],
    }).populate({
      path: 'show',
      populate: ['movie', 'theatre'],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (calculates 90% refund and frees up seats)
// @route   POST /api/bookings/:id/cancel
// @access  Protected
exports.cancelBooking = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const booking = mockStore.bookings.find(
        (b) => b._id === req.params.id || b.bookingId === req.params.id
      );
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      booking.bookingStatus = 'cancelled';
      booking.refundAmount = parseFloat((booking.totalAmount * 0.9).toFixed(2));
      booking.cancelledAt = new Date().toISOString();

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully. 90% refund initiated.',
        data: booking,
      });
    }

    const booking = await Booking.findById(req.params.id).populate('show');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
    }

    const refundAmount = parseFloat((booking.totalAmount * 0.9).toFixed(2));

    booking.bookingStatus = 'cancelled';
    booking.refundAmount = refundAmount;
    booking.cancelledAt = new Date();
    await booking.save();

    // Free up the seats
    const seatIds = booking.selectedSeats.map((s) => s.seatId);
    await Seat.updateMany(
      { _id: { $in: seatIds }, show: booking.show._id },
      {
        $set: {
          status: 'available',
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    // Increase available seats
    await Show.findByIdAndUpdate(booking.show._id, {
      $inc: { availableSeatsCount: seatIds.length },
    });

    // Notify connected clients via Socket.io
    const io = req.app.get('io');
    if (io) {
      seatIds.forEach((seatId) => {
        io.to(`show_${booking.show._id}`).emit('seat:unlocked', { seatId });
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. 90% refund initiated.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
