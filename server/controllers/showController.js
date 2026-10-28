const mongoose = require('mongoose');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const mockStore = require('../config/mockStore');

/**
 * Helper to auto-generate 60 seats for a newly scheduled show
 */
const generateSeatsForShow = async (showId, ticketPrice) => {
  const rows = [
    { row: 'A', tier: 'vip', price: ticketPrice.vip || 22 },
    { row: 'B', tier: 'vip', price: ticketPrice.vip || 22 },
    { row: 'C', tier: 'premium', price: ticketPrice.premium || 16 },
    { row: 'D', tier: 'premium', price: ticketPrice.premium || 16 },
    { row: 'E', tier: 'regular', price: ticketPrice.regular || 12 },
    { row: 'F', tier: 'regular', price: ticketPrice.regular || 12 },
  ];

  const seatDocs = [];

  for (const { row, tier, price } of rows) {
    for (let col = 1; col <= 10; col++) {
      seatDocs.push({
        show: showId,
        seatNumber: `${row}${col}`,
        row,
        column: col,
        tier,
        price,
        status: 'available',
      });
    }
  }

  await Seat.insertMany(seatDocs);
};

// @desc    Get all active shows with filters (movie, theatre, date, city)
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let results = mockStore.shows.map((s) => ({
        ...s,
        movie: s.movieObj || mockStore.movies.find((m) => m._id === s.movie) || mockStore.movies[0],
        theatre: s.theatreObj || mockStore.theatres.find((t) => t._id === s.theatre) || mockStore.theatres[0],
      }));

      if (movieId) {
        results = results.filter((s) => s.movie._id === movieId || s.movie === movieId);
      }
      if (theatreId) {
        results = results.filter((s) => s.theatre._id === theatreId || s.theatre === theatreId);
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    const query = { isActive: true };

    if (movieId) query.movie = movieId;
    if (theatreId) query.theatre = theatreId;

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.showDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const shows = await Show.find(query)
      .populate('movie', 'title genre duration posterUrl rating')
      .populate('theatre', 'name location facilities screens')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show by ID with movie and theatre info
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const show = mockStore.shows.find((s) => s._id === req.params.id) || mockStore.shows[0];
      const populated = {
        ...show,
        movie: show.movieObj || mockStore.movies.find((m) => m._id === show.movie) || mockStore.movies[0],
        theatre: show.theatreObj || mockStore.theatres.find((t) => t._id === show.theatre) || mockStore.theatres[0],
      };
      return res.status(200).json({
        success: true,
        data: populated,
      });
    }

    const show = await Show.findById(req.params.id)
      .populate('movie', 'title genre duration posterUrl rating')
      .populate('theatre', 'name location facilities screens');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.status(200).json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new show & generate 60 seats (Admin)
// @route   POST /api/shows
// @access  Protected (Admin)
exports.createShow = async (req, res, next) => {
  try {
    const { movie, theatre, screenNumber, format, showDate, showTime, ticketPrice } = req.body;

    if (!movie || !theatre || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movie, theatre, showDate, and showTime.',
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const newShow = {
        _id: '66a3' + Math.random().toString(36).substring(2, 22),
        movie,
        movieObj: mockStore.movies.find((m) => m._id === movie) || mockStore.movies[0],
        theatre,
        theatreObj: mockStore.theatres.find((t) => t._id === theatre) || mockStore.theatres[0],
        screenNumber: screenNumber || 1,
        format: format || '2D',
        showDate: new Date(showDate).toISOString(),
        showTime,
        ticketPrice: ticketPrice || { regular: 12, premium: 16, vip: 22 },
        totalSeats: 60,
        availableSeatsCount: 60,
        isActive: true,
      };

      mockStore.shows.unshift(newShow);
      mockStore.getSeats(newShow._id);

      return res.status(201).json({
        success: true,
        data: newShow,
      });
    }

    const show = await Show.create({
      movie,
      theatre,
      screenNumber: screenNumber || 1,
      format: format || '2D',
      showDate,
      showTime,
      ticketPrice: ticketPrice || { regular: 12, premium: 16, vip: 22 },
      totalSeats: 60,
      availableSeatsCount: 60,
    });

    await generateSeatsForShow(show._id, show.ticketPrice);

    res.status(201).json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel / Deactivate show (Admin)
// @route   DELETE /api/shows/:id
// @access  Protected (Admin)
exports.deleteShow = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      mockStore.shows = mockStore.shows.filter((s) => s._id !== req.params.id);
      return res.status(200).json({ success: true, message: 'Show cancelled' });
    }

    const show = await Show.findById(req.params.id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    show.isActive = false;
    await show.save();

    res.status(200).json({ success: true, message: 'Show cancelled' });
  } catch (error) {
    next(error);
  }
};
