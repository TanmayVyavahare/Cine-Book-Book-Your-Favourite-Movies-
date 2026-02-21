/**
 * ManageShows.jsx - Add, edit, delete shows (admin only)
 * When adding a show, we need movieId, date, time, price, and 50 seats (A1–E10).
 */

import { useState, useEffect } from 'react';
import {
  getMovies,
  getShowsByMovieId,
  createShow,
  updateShow,
  deleteShow,
} from '../../services/api';

function buildSeats() {
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seats = [];
  for (const row of rows) {
    for (let num = 1; num <= 10; num++) {
      seats.push({ seatNumber: `${row}${num}`, isBooked: false });
    }
  }
  return seats;
}

export default function ManageShows() {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    movie: '',
    date: '',
    time: '',
    price: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getMovies().then(({ data }) => setMovies(data)).catch(() => setMovies([]));
  }, []);

  const loadShows = async () => {
    if (!form.movie) {
      setShows([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await getShowsByMovieId(form.movie);
      setShows(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load shows.');
      setShows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
  }, [form.movie]);

  const resetForm = () => {
    setForm({ movie: form.movie, date: '', time: '', price: '' });
    setEditingId(null);
  };

  const handleEdit = (show) => {
    setEditingId(show._id);
    setForm((f) => ({
      ...f,
      date: show.date || '',
      time: show.time || '',
      price: show.price?.toString() || '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateShow(editingId, {
          date: form.date,
          time: form.time,
          price: Number(form.price),
        });
      } else {
        await createShow({
          movie: form.movie,
          date: form.date,
          time: form.time,
          price: Number(form.price),
          seats: buildSeats(),
        });
      }
      resetForm();
      loadShows();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this show?')) return;
    try {
      await deleteShow(id);
      loadShows();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="page manage-shows">
      <h1>Manage Shows</h1>
      {error && <div className="error-msg">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Movie</label>
        <select
          value={form.movie}
          onChange={(e) => setForm((f) => ({ ...f, movie: e.target.value }))}
          required
        >
          <option value="">Select movie</option>
          {movies.map((m) => (
            <option key={m._id} value={m._id}>{m.title}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Date (e.g. 2025-02-25)"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Time (e.g. 7:00 PM)"
          value={form.time}
          onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          required
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Add'} Show
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <h2>Shows for selected movie</h2>
      {loading ? (
        <div className="page-loading">
          <div className="spinner" aria-hidden="true" />
          <p>Loading shows...</p>
        </div>
      ) : (
        <div className="admin-list">
          {shows.map((s) => (
            <div key={s._id} className="admin-list-item">
              <span>{s.date} {s.time} — ₹{s.price}</span>
              <div>
                <button type="button" className="btn btn-small" onClick={() => handleEdit(s)}>
                  Edit
                </button>
                <button type="button" className="btn btn-small btn-danger" onClick={() => handleDelete(s._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {shows.length === 0 && form.movie && <p>No shows. Add one above.</p>}
        </div>
      )}
    </div>
  );
}
