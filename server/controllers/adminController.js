const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const User = require('../models/User');

// @desc    Get dashboard metrics & statistics (Admin)
// @route   GET /api/admin/stats
// @access  Protected (Admin)
exports.getStats = async (req, res, next) => {
  try {
    // 1. Total revenue from confirmed bookings
    const revenueAgg = await Booking.aggregate([
      { $match: { bookingStatus: 'confirmed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // 2. Counts
    const totalBookings = await Booking.countDocuments({ bookingStatus: 'confirmed' });
    const totalCancelled = await Booking.countDocuments({ bookingStatus: 'cancelled' });
    const activeMovies = await Movie.countDocuments({ isActive: true });
    const totalTheatres = await Theatre.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: 'customer' });

    // 3. Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: ['movie', 'theatre'],
      })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalBookings,
        totalCancelled,
        activeMovies,
        totalTheatres,
        totalUsers,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings across the platform (Admin)
// @route   GET /api/admin/bookings
// @access  Protected (Admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    if (search && search.trim() !== '') {
      query.bookingId = { $regex: search.trim(), $options: 'i' };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
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

// @desc    Get all users list (Admin)
// @route   GET /api/admin/users
// @access  Protected (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
