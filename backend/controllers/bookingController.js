/**
 * bookingController.js - Create booking and get bookings
 * Book seats (protected), get my bookings (protected), get all (admin only).
 */

const Booking = require('../models/Booking');
const Show = require('../models/Show');

/**
 * POST /api/bookings - Book seats (user, protected)
 * Body: { showId, seats: ["A1", "A2"] }
 * Marks seats as booked in Show and creates Booking.
 */
const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Show ID and at least one seat are required.' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }

    // Validate and mark seats as booked
    for (const seatNum of seats) {
      const seat = show.seats.find((s) => s.seatNumber === seatNum);
      if (!seat) {
        return res.status(400).json({ message: `Invalid seat: ${seatNum}.` });
      }
      if (seat.isBooked) {
        return res.status(400).json({ message: `Seat ${seatNum} is already booked.` });
      }
      seat.isBooked = true;
    }
    await show.save();

    const totalPrice = seats.length * show.price;
    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      totalPrice,
      status: 'confirmed',
    });

    const populated = await Booking.findById(booking._id)
      .populate('show')
      .populate({ path: 'show', populate: { path: 'movie', select: 'title poster' } });
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Booking failed.' });
  }
};

/**
 * GET /api/bookings/mine - My bookings (user, protected)
 */
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('show')
      .populate({ path: 'show', populate: { path: 'movie', select: 'title poster' } })
      .sort({ bookedAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch bookings.' });
  }
};

/**
 * GET /api/bookings/all - All bookings (admin only)
 */
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('show')
      .populate({ path: 'show', populate: { path: 'movie', select: 'title poster' } })
      .sort({ bookedAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch bookings.' });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings };
