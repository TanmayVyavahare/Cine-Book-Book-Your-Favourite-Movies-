/**
 * SeatSelection.jsx - Seat map + booking summary; Confirm & Pay opens Razorpay checkout
 * On success: verify payment, create booking, redirect to confirmation with booking + payment ID
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getShowById, createOrder, verifyPayment } from '../services/api';
import SeatMap from '../components/SeatMap';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getShowById(showId);
        setShow(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load show.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showId]);

  const toggleSeat = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const totalPrice = selectedSeats.length * (show.price || 0);
      const { data: orderData } = await createOrder(totalPrice);
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError('Payment failed. Could not load payment gateway.');
        setSubmitting(false);
        return;
      }
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'CineBook',
        description: 'Movie Ticket Booking',
        order_id: orderData.orderId,
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#e50914' },
        // Show UPI first, then Card, Wallet, Netbanking (Razorpay Standard Checkout)
        config: {
          display: {
            blocks: {
              banks: {
                name: 'Payment Options',
                instruments: [
                  { method: 'upi' },
                  { method: 'card' },
                  { method: 'wallet' },
                  { method: 'netbanking' },
                ],
              },
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: false,
            },
          },
        },
        handler: async function (response) {
          try {
            const { data } = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              showId,
              seats: selectedSeats,
              totalPrice,
            });
            navigate('/confirmation', {
              state: {
                booking: data.booking,
                razorpay_payment_id: data.razorpay_payment_id,
              },
            });
          } catch (err) {
            setError(err.response?.data?.message || 'Payment failed. Please try again.');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Payment failed. Please try again.';
      setError(msg);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" aria-hidden="true" />
        <p>Loading seats...</p>
      </div>
    );
  }
  if (error && !show) return <div className="error-msg">{error}</div>;
  if (!show) return <div className="error-msg">Show not found.</div>;

  const totalPrice = selectedSeats.length * (show.price || 0);

  return (
    <div className="page seat-selection-page">
      <h1>Select Seats</h1>
      <p className="show-summary">
        {show.movie?.title} — {show.date} {show.time} — ₹{show.price} per seat
      </p>
      <div className="seat-selection-layout">
        <div>
          <SeatMap
            seats={show.seats || []}
            selectedSeats={selectedSeats}
            onSeatToggle={toggleSeat}
            disabled={submitting}
          />
          {error && <div className="error-msg">{error}</div>}
        </div>
        <div className="booking-summary-card">
          <h3>Booking Summary</h3>
          <p><strong>Seats:</strong> {selectedSeats.join(', ') || 'None'}</p>
          <p><strong>Total:</strong> ₹{totalPrice}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={selectedSeats.length === 0 || submitting}
          >
            {submitting ? 'Processing...' : 'Confirm & Pay'}
          </button>
        </div>
      </div>
    </div>
  );
}
