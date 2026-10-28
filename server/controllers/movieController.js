const Movie = require('../models/Movie');
const Show = require('../models/Show');

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const { genre, language, search, activeOnly } = req.query;

    const query = {};

    // Filter active movies unless specified otherwise
    if (activeOnly !== 'false') {
      query.isActive = true;
    }

    // Genre filter
    if (genre && genre !== 'All') {
      query.genre = { $in: [genre] };
    }

    // Language filter
    if (language && language !== 'All') {
      query.language = new RegExp(`^${language}$`, 'i');
    }

    // Keyword search
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
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Fetch upcoming shows for this movie
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

    // If an image was uploaded via Multer
    if (req.file) {
      posterUrl = `/uploads/${req.file.filename}`;
    }

    if (!posterUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a poster image URL or upload an image file.',
      });
    }

    // Parse array fields if passed as strings (e.g. from FormData)
    if (typeof genre === 'string') {
      try {
        genre = JSON.parse(genre);
      } catch {
        genre = genre.split(',').map((g) => g.trim());
      }
    }

    if (typeof cast === 'string') {
      try {
        cast = JSON.parse(cast);
      } catch {
        cast = cast.split(',').map((c) => c.trim());
      }
    }

    const movie = await Movie.create({
      title,
      description,
      genre,
      language: language || 'English',
      duration: Number(duration),
      releaseDate,
      posterUrl,
      backdropUrl: backdropUrl || posterUrl,
      trailerUrl: trailerUrl || '',
      rating: rating ? Number(rating) : 8.0,
      director: director || '',
      cast: cast || [],
    });

    res.status(201).json({
      success: true,
      message: 'Movie added successfully!',
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
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Handle uploaded file if present
    if (req.file) {
      req.body.posterUrl = `/uploads/${req.file.filename}`;
    }

    // Parse array fields if necessary
    if (typeof req.body.genre === 'string') {
      try {
        req.body.genre = JSON.parse(req.body.genre);
      } catch {
        req.body.genre = req.body.genre.split(',').map((g) => g.trim());
      }
    }

    if (typeof req.body.cast === 'string') {
      try {
        req.body.cast = JSON.parse(req.body.cast);
      } catch {
        req.body.cast = req.body.cast.split(',').map((c) => c.trim());
      }
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully!',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or deactivate movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Protected (Admin)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Soft delete by setting isActive to false
    movie.isActive = false;
    await movie.save();

    res.status(200).json({
      success: true,
      message: 'Movie removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
