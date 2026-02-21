/**
 * MyBookings.jsx - Booking cards with poster thumbnail, date/time/seats/price, green Confirmed badge
 */

import { useState, useEffect } from 'react';
import { getMyBookings } from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getMyBookings();
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
        <p>Loading your bookings...</p>
      </div>
    );
  }
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="page my-bookings-page">
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="empty-state">You have no bookings yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <div className="booking-card-poster">
                {b.show?.movie?.poster ? (
                  <img src={b.show.movie.poster} alt={b.show.movie.title} />
                ) : (
                  <div className="placeholder">
                    {b.show?.movie?.title?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="booking-card-body">
                <h3>{b.show?.movie?.title}</h3>
                <p>{b.show?.date} — {b.show?.time}</p>
                <p>Seats: {b.seats?.join(', ')}</p>
                <p>Total: ₹{b.totalPrice}</p>
                <span className="booking-badge">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
