/**
 * paymentController.js - Razorpay order creation and payment verification
 * createOrder: creates Razorpay order and returns orderId, amount, keyId
 * verifyPayment: verifies signature, then creates booking and marks seats booked
 */

const crypto = require('crypto');
const Razorpay = require('razorpay');
const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Razorpay instance (key_secret from env)
const getRazorpay = () => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error('RAZORPAY_KEY_SECRET is not set');
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: keySecret });
};

/**
 * POST /api/payments/create-order - Create Razorpay order (protected)
 * Body: { amount } (in rupees). Returns { orderId, amount, currency, keyId }.
 * Razorpay expects amount in paise for INR.
 */
const createOrder = async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return res.status(500).json({
        message: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env and restart the server.',
      });
    }
    const amount = Math.round(Number(req.body.amount));
    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Valid amount is required.' });
    }
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise (Razorpay expects smallest currency unit for INR)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency || 'INR',
      keyId,
    });
  } catch (error) {
    const msg = error.description || error.error?.description || error.message || 'Failed to create order.';
    res.status(500).json({ message: msg });
  }
};

/**
 * Verify Razorpay signature using HMAC SHA256
 */
const verifySignature = (orderId, paymentId, signature, secret) => {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === signature;
};

/**
 * POST /api/payments/verify - Verify payment and create booking (protected)
 * Body: razorpay_order_id, razorpay_payment_id, razorpay_signature, showId, seats, totalPrice
 * On success: create booking, mark seats booked, return booking.
 */
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      showId,
      seats,
      totalPrice,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Missing required payment or booking data.' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Payment is not configured.' });
    }

    const isValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature, secret);
    if (!isValid) {
      return res.status(400).json({ message: 'Payment verification failed.' });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }

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

    const total = Number(totalPrice) || seats.length * show.price;
    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      totalPrice: total,
      status: 'confirmed',
    });

    const populated = await Booking.findById(booking._id)
      .populate('show')
      .populate({ path: 'show', populate: { path: 'movie', select: 'title poster' } });
    res.status(201).json({
      booking: populated,
      razorpay_payment_id: razorpay_payment_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Booking failed.' });
  }
};

module.exports = { createOrder, verifyPayment };
