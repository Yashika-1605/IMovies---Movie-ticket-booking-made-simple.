const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

/**
 * Helper to auto-generate 60 seats for a newly scheduled show
 * Rows A & B: VIP (10 seats each)
 * Rows C & D: Premium (10 seats each)
 * Rows E & F: Regular (10 seats each)
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
    const { movieId, theatreId, date, city } = req.query;
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

    let showsQuery = Show.find(query)
      .populate('movie', 'title genre duration posterUrl rating language')
      .populate('theatre', 'name location facilities')
      .sort({ showDate: 1, showTime: 1 });

    let shows = await showsQuery;

    // Filter by city if specified
    if (city && city !== 'All') {
      shows = shows.filter(
        (show) =>
          show.theatre &&
          show.theatre.location &&
          show.theatre.location.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get show by ID
// @route   GET /api/shows/:id
// @access  Public
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

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

// @desc    Create show and auto-initialize 60 seats (Admin)
// @route   POST /api/shows
// @access  Protected (Admin)
exports.createShow = async (req, res, next) => {
  try {
    const {
      movie,
      theatre,
      screenNumber,
      format,
      showDate,
      showTime,
      ticketPrice,
    } = req.body;

    if (!movie || !theatre || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movie, theatre, showDate, and showTime.',
      });
    }

    // Verify movie and theatre exist
    const movieDoc = await Movie.findById(movie);
    if (!movieDoc) {
      return res.status(404).json({ success: false, message: 'Movie not found.' });
    }

    const theatreDoc = await Theatre.findById(theatre);
    if (!theatreDoc) {
      return res.status(404).json({ success: false, message: 'Theatre not found.' });
    }

    const priceConfig = {
      regular: ticketPrice?.regular ? Number(ticketPrice.regular) : 12,
      premium: ticketPrice?.premium ? Number(ticketPrice.premium) : 16,
      vip: ticketPrice?.vip ? Number(ticketPrice.vip) : 22,
    };

    const show = await Show.create({
      movie,
      theatre,
      screenNumber: screenNumber || 1,
      format: format || '2D',
      showDate: new Date(showDate),
      showTime,
      ticketPrice: priceConfig,
      totalSeats: 60,
      availableSeatsCount: 60,
    });

    // Auto-generate seats for this show
    await generateSeatsForShow(show._id, priceConfig);

    res.status(201).json({
      success: true,
      message: 'Show scheduled and 60 seats generated successfully!',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show & remove seats (Admin)
// @route   DELETE /api/shows/:id
// @access  Protected (Admin)
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Soft delete or deactivate
    show.isActive = false;
    await show.save();

    res.status(200).json({
      success: true,
      message: 'Show cancelled and deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
