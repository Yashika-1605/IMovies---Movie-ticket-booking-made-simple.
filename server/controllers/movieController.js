const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Show = require('../models/Show');
const mockStore = require('../config/mockStore');

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const { genre, language, search, activeOnly } = req.query;

    if (mongoose.connection.readyState !== 1) {
      let results = [...mockStore.movies];
      if (activeOnly !== 'false') {
        results = results.filter((m) => m.isActive);
      }
      if (genre && genre !== 'All') {
        results = results.filter((m) => m.genre && m.genre.includes(genre));
      }
      if (language && language !== 'All') {
        results = results.filter((m) => m.language && m.language.toLowerCase() === language.toLowerCase());
      }
      if (search && search.trim() !== '') {
        const q = search.trim().toLowerCase();
        results = results.filter((m) =>
          (m.title && m.title.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q))
        );
      }
      return res.status(200).json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    const query = {};
    if (activeOnly !== 'false') {
      query.isActive = true;
    }
    if (genre && genre !== 'All') {
      query.genre = { $in: [genre] };
    }
    if (language && language !== 'All') {
      query.language = new RegExp(`^${language}$`, 'i');
    }
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const movies = await Movie.find(query).sort({ rating: -1, releaseDate: -1 });

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured / top rated movies for banner & homepage
// @route   GET /api/movies/featured
// @access  Public
exports.getFeaturedMovies = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 5,
        data: mockStore.movies.slice(0, 5),
      });
    }

    const featured = await Movie.find({ isActive: true })
      .sort({ rating: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      count: featured.length,
      data: featured,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID with upcoming shows
// @route   GET /api/movies/:id
// @access  Public
exports.getMovieById = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const movie =
        mockStore.movies.find(
          (m) =>
            m._id === req.params.id ||
            m.title.toLowerCase().replace(/[^a-z0-9]/g, '') === req.params.id
        ) || mockStore.movies[0];

      const shows = mockStore.shows
        .filter((s) => s.movie === movie._id || s.movieObj?._id === movie._id)
        .map((s) => ({
          ...s,
          theatre: s.theatreObj || mockStore.theatres[0],
        }));

      return res.status(200).json({
        success: true,
        data: {
          movie,
          shows,
        },
      });
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const shows = await Show.find({
      movie: movie._id,
      isActive: true,
      showDate: { $gte: today },
    })
      .populate('theatre', 'name location facilities')
      .sort({ showDate: 1, showTime: 1 });

    res.status(200).json({
      success: true,
      data: {
        movie,
        shows,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie (Admin)
// @route   POST /api/movies
// @access  Protected (Admin)
exports.createMovie = async (req, res, next) => {
  try {
    let {
      title,
      description,
      genre,
      language,
      duration,
      releaseDate,
      posterUrl,
      backdropUrl,
      trailerUrl,
      rating,
      director,
      cast,
    } = req.body;

    if (req.file) {
      posterUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    if (typeof genre === 'string') {
      genre = genre.split(',').map((g) => g.trim());
    }

    if (typeof cast === 'string') {
      cast = cast.split(',').map((c) => c.trim());
    }

    if (mongoose.connection.readyState !== 1) {
      const newMovie = {
        _id: '66a1' + Math.random().toString(36).substring(2, 22),
        title,
        description,
        genre: genre || ['Drama'],
        language: language || 'English',
        duration: Number(duration) || 120,
        releaseDate: releaseDate || new Date().toISOString(),
        posterUrl:
          posterUrl ||
          'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
        backdropUrl:
          backdropUrl ||
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
        trailerUrl,
        rating: Number(rating) || 8.0,
        director: director || 'Director',
        cast: cast || ['Lead Actor'],
        isActive: true,
      };
      mockStore.movies.unshift(newMovie);
      return res.status(201).json({
        success: true,
        data: newMovie,
      });
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      language,
      duration,
      releaseDate,
      posterUrl,
      backdropUrl,
      trailerUrl,
      rating,
      director,
      cast,
    });

    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
// @access  Protected (Admin)
exports.updateMovie = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const idx = mockStore.movies.findIndex((m) => m._id === req.params.id);
      if (idx >= 0) {
        mockStore.movies[idx] = { ...mockStore.movies[idx], ...req.body };
        return res.status(200).json({ success: true, data: mockStore.movies[idx] });
      }
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    let movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete / Deactivate movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Protected (Admin)
exports.deleteMovie = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      mockStore.movies = mockStore.movies.filter((m) => m._id !== req.params.id);
      return res.status(200).json({ success: true, message: 'Movie deactivated' });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    movie.isActive = false;
    await movie.save();

    res.status(200).json({ success: true, message: 'Movie deactivated' });
  } catch (error) {
    next(error);
  }
};
