/**
 * MovieDetail.jsx - Movie info + showtimes
 * Fetches movie and its shows. User can pick a show to go to seat selection.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getShowsByMovieId } from '../services/api';

// Format date string for display
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [posterError, setPosterError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [movieRes, showsRes] = await Promise.all([
          getMovieById(id),
          getShowsByMovieId(id),
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleSelectShow = (showId) => {
    navigate(`/show/${showId}/seats`);
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" aria-hidden="true" />
        <p>Loading movie...</p>
      </div>
    );
  }
  if (error) return <div className="error-msg">{error}</div>;
  if (!movie) return <div className="error-msg">Movie not found.</div>;

  const showPoster = movie.poster && !posterError;

  return (
    <div className="page movie-detail-page">
      <div className="movie-detail-header">
        <div className="movie-detail-poster-wrap">
          {showPoster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="movie-detail-poster"
              onError={() => setPosterError(true)}
            />
          ) : (
            <div className="movie-detail-poster placeholder">{movie.title?.charAt(0)}</div>
          )}
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            {movie.genre && <span className="meta-tag">{movie.genre}</span>}
            {movie.duration > 0 && <span>{movie.duration} min</span>}
            {movie.rating > 0 && <span className="meta-rating">★ {movie.rating}</span>}
          </div>
          {movie.description && <p className="movie-desc">{movie.description}</p>}
        </div>
      </div>
      <section className="showtimes">
        <h2>Choose a showtime</h2>
        <div className="shows-list">
          {shows.map((show) => (
            <div key={show._id} className="show-card">
              <div className="show-card-left">
                <span className="show-date">{formatDate(show.date)}</span>
                <span className="show-time">{show.time}</span>
              </div>
              <span className="show-price">₹{show.price}</span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleSelectShow(show._id)}
              >
                Select Seats
              </button>
            </div>
          ))}
        </div>
        {shows.length === 0 && <p className="empty-shows">No showtimes available for this movie.</p>}
      </section>
    </div>
  );
}
