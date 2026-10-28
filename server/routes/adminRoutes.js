const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllBookings,
  getAllUsers,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require protect and admin role
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/bookings', getAllBookings);
router.get('/users', getAllUsers);

module.exports = router;
