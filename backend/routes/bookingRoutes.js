/**
 * bookingRoutes.js - Booking API routes
 * POST and GET /mine require login; GET /all requires admin.
 */

const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, createBooking);
router.get('/mine', protect, getMyBookings);
router.get('/all', protect, adminOnly, getAllBookings);

module.exports = router;
