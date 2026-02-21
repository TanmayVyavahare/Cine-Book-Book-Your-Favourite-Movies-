/**
 * Confirmation.jsx - Booking success: checkmark, movie/show/seats/total, Razorpay Payment ID, Go Home
 */

import { Link, useLocation } from 'react-router-dom';

export default function Confirmation() {
  const location = useLocation();
  const booking = location.state?.booking;
  const razorpayPaymentId = location.state?.razorpay_payment_id;

  if (!booking) {
    return (
      <div className="page confirmation-page">
        <div className="empty-state">
          <p>No booking data found.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const movieTitle = booking.show?.movie?.title || 'Movie';
  const show = booking.show;

  return (
    <div className="page confirmation-page">
      <div className="confirmation-checkmark" aria-hidden="true">✓</div>
      <h1>Booking Confirmed!</h1>
      <div className="confirmation-card">
        <p><strong>Movie:</strong> {movieTitle}</p>
        <p><strong>Date & Time:</strong> {show?.date} {show?.time}</p>
        <p><strong>Seats:</strong> {booking.seats?.join(', ')}</p>
        <p><strong>Total amount paid:</strong> ₹{booking.totalPrice}</p>
        {razorpayPaymentId && (
          <p><strong>Razorpay Payment ID:</strong> {razorpayPaymentId}</p>
        )}
      </div>
      <Link to="/" className="btn btn-primary confirmation-go-home">Go Home</Link>
    </div>
  );
}
