/**
 * ManageMovies.jsx - Add, edit, delete movies (admin only)
 */

import { useState, useEffect } from 'react';
import { getMovies, createMovie, updateMovie, deleteMovie } from '../../services/api';

export default function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    genre: '',
    duration: '',
    rating: '',
    poster: '',
    language: '',
  });
  const [error, setError] = useState('');

  const loadMovies = async () => {
    try {
      const { data } = await getMovies();
      setMovies(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      genre: '',
      duration: '',
      rating: '',
      poster: '',
      language: '',
    });
    setEditingId(null);
  };

  const handleEdit = (movie) => {
    setEditingId(movie._id);
    setForm({
      title: movie.title || '',
      description: movie.description || '',
      genre: movie.genre || '',
      duration: movie.duration || '',
      rating: movie.rating || '',
      poster: movie.poster || '',
      language: movie.language || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      duration: form.duration ? Number(form.duration) : 0,
      rating: form.rating ? Number(form.rating) : 0,
    };
    try {
      if (editingId) {
        await updateMovie(editingId, payload);
      } else {
        await createMovie(payload);
      }
      resetForm();
      loadMovies();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await deleteMovie(id);
      loadMovies();
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" aria-hidden="true" />
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="page manage-movies">
      <h1>Manage Movies</h1>
      {error && <div className="error-msg">{error}</div>}
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <input
          placeholder="Genre"
          value={form.genre}
          onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={form.duration}
          onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Rating (1-10)"
          min="1"
          max="10"
          value={form.rating}
          onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))}
        />
        <input
          placeholder="Poster URL"
          value={form.poster}
          onChange={(e) => setForm((f) => ({ ...f, poster: e.target.value }))}
        />
        <input
          placeholder="Language"
          value={form.language}
          onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update' : 'Add'} Movie
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <div className="admin-list">
        {movies.map((m) => (
          <div key={m._id} className="admin-list-item">
            <span>{m.title}</span>
            <div>
              <button type="button" className="btn btn-small" onClick={() => handleEdit(m)}>
                Edit
              </button>
              <button type="button" className="btn btn-small btn-danger" onClick={() => handleDelete(m._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
