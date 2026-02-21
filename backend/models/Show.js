/**
 * Show.js - Mongoose model for showtimes
 * Links a movie to a date, time, price, and a list of seats (seatNumber + isBooked).
 * Used for seat selection and booking.
 */

const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String, // e.g. "A1", "B5"
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    date: {
      type: String, // e.g. "2025-02-25"
      required: true,
    },
    time: {
      type: String, // e.g. "7:00 PM"
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    seats: [seatSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Show', showSchema);
