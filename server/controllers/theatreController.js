const Theatre = require('../models/Theatre');
const Show = require('../models/Show');

// @desc    Get all active theatres (filter by city)
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city && city !== 'All') {
      query['location.city'] = new RegExp(`^${city}$`, 'i');
    }

    const theatres = await Theatre.find(query).sort({ 'location.city': 1, name: 1 });

    res.status(200).json({
      success: true,
      count: theatres.length,
      data: theatres,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct cities where theatres exist
// @route   GET /api/theatres/cities
// @access  Public
exports.getCities = async (req, res, next) => {
  try {
    const cities = await Theatre.distinct('location.city', { isActive: true });

    res.status(200).json({
      success: true,
      data: cities.sort(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre details with today's/upcoming shows
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const shows = await Show.find({
      theatre: theatre._id,
      isActive: true,
      showDate: { $gte: today },
    })
      .populate('movie', 'title genre duration posterUrl rating')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      success: true,
      data: {
        theatre,
        shows,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new theatre (Admin)
// @route   POST /api/theatres
// @access  Protected (Admin)
exports.createTheatre = async (req, res, next) => {
  try {
    const { name, location, screens, facilities } = req.body;

    if (!name || !location || !location.city || !location.address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide theatre name, city, and address.',
      });
    }

    const theatre = await Theatre.create({
      name,
      location,
      screens: screens ? Number(screens) : 3,
      facilities: facilities || ['Dolby Atmos', '4K Projection', 'Food Court'],
    });

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully!',
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre (Admin)
// @route   PUT /api/theatres/:id
// @access  Protected (Admin)
exports.updateTheatre = async (req, res, next) => {
  try {
    let theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Theatre updated successfully!',
      data: theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre (Admin)
// @route   DELETE /api/theatres/:id
// @access  Protected (Admin)
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    theatre.isActive = false;
    await theatre.save();

    res.status(200).json({
      success: true,
      message: 'Theatre deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
