/**
 * AllBookings.jsx - View all user bookings (admin only)
 */

import { useState, useEffect } from 'react';
import { getAllBookings } from '../../services/api';

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getAllBookings();
        setBookings(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load bookings.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" aria-hidden="true" />
        <p>Loading bookings...</p>
      </div>
    );
  }
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="page all-bookings">
      <h1>All Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="bookings-list admin-bookings">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card admin-booking-card">
              <div className="booking-card-poster">
                {b.show?.movie?.poster ? (
                  <img src={b.show.movie.poster} alt={b.show.movie.title} />
                ) : (
                  <div className="placeholder">{b.show?.movie?.title?.charAt(0)}</div>
                )}
              </div>
              <div className="booking-card-body">
                <p><strong>User:</strong> {b.user?.name} ({b.user?.email})</p>
                <p><strong>Movie:</strong> {b.show?.movie?.title}</p>
                <p><strong>Date & Time:</strong> {b.show?.date} {b.show?.time}</p>
                <p><strong>Seats:</strong> {b.seats?.join(', ')}</p>
                <p><strong>Total:</strong> ₹{b.totalPrice} • {b.status}</p>
                <p><strong>Booked at:</strong> {new Date(b.bookedAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
