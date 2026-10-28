const express = require('express');
const router = express.Router();
const {
  getMovies,
  getFeaturedMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

// Public routes
router.get('/', getMovies);
router.get('/featured', getFeaturedMovies);
router.get('/:id', getMovieById);

// Protected Admin routes (with optional poster upload)
router.post('/', protect, authorize('admin'), upload.single('poster'), createMovie);
router.put('/:id', protect, authorize('admin'), upload.single('poster'), updateMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router;
