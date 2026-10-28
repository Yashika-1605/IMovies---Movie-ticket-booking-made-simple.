const mongoose = require('mongoose');
const Seat = require('../models/Seat');
const Show = require('../models/Show');
const mockStore = require('../config/mockStore');

// @desc    Get seats for a show (with auto-release of expired locks)
// @route   GET /api/seats/show/:showId
// @access  Public
exports.getSeatsByShow = async (req, res, next) => {
  try {
    const { showId } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const show = mockStore.shows.find((s) => s._id === showId) || mockStore.shows[0];
      const seats = mockStore.getSeats(showId);
      return res.status(200).json({
        success: true,
        count: seats.length,
        data: {
          show: {
            ...show,
            movie: show.movieObj || mockStore.movies[0],
            theatre: show.theatreObj || mockStore.theatres[0],
          },
          seats,
        },
      });
    }

    // Check show existence
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Auto-release any expired locks
    const now = new Date();
    await Seat.updateMany(
      {
        show: showId,
        status: 'locked',
        lockedUntil: { $lte: now },
      },
      {
        $set: {
          status: 'available',
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    // Fetch updated seats sorted by row and column
    const seats = await Seat.find({ show: showId }).sort({ row: 1, column: 1 });

    res.status(200).json({
      success: true,
      count: seats.length,
      data: {
        show,
        seats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    HTTP fallback: lock seats for user
// @route   POST /api/seats/lock
// @access  Protected
exports.lockSeats = async (req, res, next) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : 'demo-user-id';

    if (!showId || !Array.isArray(seatIds) || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and an array of seatIds.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const seats = mockStore.getSeats(showId);
      const lockedUntil = new Date(Date.now() + 10 * 60 * 1000);
      seatIds.forEach((id) => {
        const s = seats.find((seat) => seat._id === id || seat.seatNumber === id);
        if (s && s.status === 'available') {
          s.status = 'locked';
          s.lockedBy = userId;
          s.lockedUntil = lockedUntil;
        }
      });
      return res.status(200).json({
        success: true,
        message: 'Seats locked successfully for 10 minutes.',
        data: { lockedUntil },
      });
    }

    const now = new Date();
    const lockedUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if any seat is already booked or locked by someone else
    const conflictingSeats = await Seat.find({
      _id: { $in: seatIds },
      show: showId,
      $or: [
        { status: 'booked' },
        {
          status: 'locked',
          lockedBy: { $ne: userId },
          lockedUntil: { $gt: now },
        },
      ],
    });

    if (conflictingSeats.length > 0) {
      const conflictNames = conflictingSeats.map((s) => s.seatNumber).join(', ');
      return res.status(409).json({
        success: false,
        message: `Seats (${conflictNames}) are no longer available. Please select different seats.`,
      });
    }

    // Lock seats
    await Seat.updateMany(
      { _id: { $in: seatIds }, show: showId },
      {
        $set: {
          status: 'locked',
          lockedBy: userId,
          lockedUntil,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Seats locked successfully for 10 minutes.',
      data: {
        lockedUntil,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    HTTP fallback: unlock seats
// @route   POST /api/seats/unlock
// @access  Protected
exports.unlockSeats = async (req, res, next) => {
  try {
    const { showId, seatIds } = req.body;
    const userId = req.user ? (req.user._id || req.user.id) : null;

    if (!showId || !Array.isArray(seatIds)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide showId and seatIds',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const seats = mockStore.getSeats(showId);
      seatIds.forEach((id) => {
        const s = seats.find((seat) => seat._id === id || seat.seatNumber === id);
        if (s && s.status === 'locked') {
          s.status = 'available';
          s.lockedBy = null;
          s.lockedUntil = null;
        }
      });
      return res.status(200).json({ success: true, message: 'Seats unlocked.' });
    }

    await Seat.updateMany(
      {
        _id: { $in: seatIds },
        show: showId,
        lockedBy: userId,
      },
      {
        $set: {
          status: 'available',
          lockedBy: null,
          lockedUntil: null,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Seats unlocked.',
    });
  } catch (error) {
    next(error);
  }
};
