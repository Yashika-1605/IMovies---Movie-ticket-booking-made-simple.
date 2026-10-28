const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowById,
  createShow,
  deleteShow,
} = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getShows);
router.get('/:id', getShowById);

// Protected Admin routes
router.post('/', protect, authorize('admin'), createShow);
router.delete('/:id', protect, authorize('admin'), deleteShow);

module.exports = router;
