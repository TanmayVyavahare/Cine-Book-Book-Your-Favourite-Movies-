/**
 * Movie.js - Mongoose model for movies
 * Stores movie metadata: title, description, genre, duration, rating, poster, language, releaseDate.
 * Referenced by Show model for showtimes.
 */

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    genre: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      default: 0,
    },
    poster: {
      type: String, // image URL
      default: '',
    },
    language: {
      type: String,
      default: '',
    },
    releaseDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
