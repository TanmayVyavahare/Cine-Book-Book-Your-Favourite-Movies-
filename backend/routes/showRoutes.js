/**
 * showRoutes.js - Show API routes
 * GET by movieId and GET detail/:showId are public; POST, PUT, DELETE require admin.
 */

const express = require('express');
const router = express.Router();
const {
  getShowsByMovieId,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
} = require('../controllers/showController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Order matters: detail/:showId must come before :movieId
router.get('/detail/:showId', getShowById);
router.get('/:movieId', getShowsByMovieId);
router.post('/', protect, adminOnly, createShow);
router.put('/:id', protect, adminOnly, updateShow);
router.delete('/:id', protect, adminOnly, deleteShow);

module.exports = router;
