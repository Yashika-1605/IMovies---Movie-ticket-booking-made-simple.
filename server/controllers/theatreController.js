const mongoose = require('mongoose');
const Theatre = require('../models/Theatre');
const Show = require('../models/Show');
const mockStore = require('../config/mockStore');

// @desc    Get all active theatres (filter by city)
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let results = [...mockStore.theatres];
      if (city && city !== 'All') {
        results = results.filter(
          (t) => t.location && t.location.city.toLowerCase() === city.toLowerCase()
        );
      }
      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
      });
    }

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
    if (mongoose.connection.readyState !== 1) {
      const cities = Array.from(new Set(mockStore.theatres.map((t) => t.location.city))).sort();
      return res.status(200).json({
        success: true,
        data: cities,
      });
    }

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
    if (mongoose.connection.readyState !== 1) {
      const theatre =
        mockStore.theatres.find((t) => t._id === req.params.id) || mockStore.theatres[0];
      const shows = mockStore.shows.filter(
        (s) => s.theatre === theatre._id || s.theatreObj?._id === theatre._id
      );
      return res.status(200).json({
        success: true,
        data: {
          theatre,
          shows,
        },
      });
    }

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

    if (mongoose.connection.readyState !== 1) {
      const newTheatre = {
        _id: '66a2' + Math.random().toString(36).substring(2, 22),
        name,
        location,
        screens: screens ? Number(screens) : 3,
        facilities: facilities || ['Dolby Atmos', '4K Projection', 'Food Court'],
        isActive: true,
      };
      mockStore.theatres.push(newTheatre);
      return res.status(201).json({
        success: true,
        data: newTheatre,
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
    if (mongoose.connection.readyState !== 1) {
      const idx = mockStore.theatres.findIndex((t) => t._id === req.params.id);
      if (idx >= 0) {
        mockStore.theatres[idx] = { ...mockStore.theatres[idx], ...req.body };
        return res.status(200).json({ success: true, data: mockStore.theatres[idx] });
      }
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    let theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete / Deactivate theatre (Admin)
// @route   DELETE /api/theatres/:id
// @access  Protected (Admin)
exports.deleteTheatre = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      mockStore.theatres = mockStore.theatres.filter((t) => t._id !== req.params.id);
      return res.status(200).json({ success: true, message: 'Theatre deactivated' });
    }

    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    theatre.isActive = false;
    await theatre.save();

    res.status(200).json({ success: true, message: 'Theatre deactivated' });
  } catch (error) {
    next(error);
  }
};
