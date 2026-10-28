const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getCities,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} = require('../controllers/theatreController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getTheatres);
router.get('/cities', getCities);
router.get('/:id', getTheatreById);

// Protected Admin routes
router.post('/', protect, authorize('admin'), createTheatre);
router.put('/:id', protect, authorize('admin'), updateTheatre);
router.delete('/:id', protect, authorize('admin'), deleteTheatre);

module.exports = router;
