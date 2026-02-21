/**
 * movieController.js - CRUD for movies
 * GET all / GET one are public; POST, PUT, DELETE require admin.
 */

const Movie = require('../models/Movie');

/**
 * GET /api/movies - Get all movies (public)
 */
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch movies.' });
  }
};

/**
 * GET /api/movies/:id - Get single movie (public)
 */
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch movie.' });
  }
};

/**
 * POST /api/movies - Add movie (admin only)
 */
const createMovie = async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create movie.' });
  }
};

/**
 * PUT /api/movies/:id - Update movie (admin only)
 */
const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    res.json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to update movie.' });
  }
};

/**
 * DELETE /api/movies/:id - Delete movie (admin only)
 */
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    res.json({ message: 'Movie deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to delete movie.' });
  }
};

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };
