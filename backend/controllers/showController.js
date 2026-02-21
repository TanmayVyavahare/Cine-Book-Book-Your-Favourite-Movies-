/**
 * showController.js - CRUD for shows
 * GET by movieId and GET show detail are public; create/update/delete require admin.
 */

const Show = require('../models/Show');
const Movie = require('../models/Movie');

/**
 * GET /api/shows/:movieId - Get all shows for a movie (public)
 */
const getShowsByMovieId = async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId })
      .populate('movie', 'title duration')
      .sort({ date: 1, time: 1 });
    res.json(shows);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch shows.' });
  }
};

/**
 * GET /api/shows/detail/:showId - Get show with full seat map (public)
 */
const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId).populate('movie', 'title duration');
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }
    res.json(show);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch show.' });
  }
};

/**
 * POST /api/shows - Add show (admin only). Expects movie, date, time, price, seats array.
 */
const createShow = async (req, res) => {
  try {
    const show = await Show.create(req.body);
    const populated = await Show.findById(show._id).populate('movie', 'title');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create show.' });
  }
};

/**
 * PUT /api/shows/:id - Update show (admin only)
 */
const updateShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('movie', 'title');
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }
    res.json(show);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update show.' });
  }
};

/**
 * DELETE /api/shows/:id - Delete show (admin only)
 */
const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }
    res.json({ message: 'Show deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete show.' });
  }
};

module.exports = {
  getShowsByMovieId,
  getShowById,
  createShow,
  updateShow,
  deleteShow,
};
