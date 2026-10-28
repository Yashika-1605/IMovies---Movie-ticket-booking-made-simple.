const express = require('express');
const router = express.Router();
const {
  getSeatsByShow,
  lockSeats,
  unlockSeats,
} = require('../controllers/seatController');
const { protect } = require('../middleware/auth');

router.get('/show/:showId', getSeatsByShow);
router.post('/lock', protect, lockSeats);
router.post('/unlock', protect, unlockSeats);

module.exports = router;
