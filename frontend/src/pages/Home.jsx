/**
 * Home.jsx - Movie listing page
 * Fetches all movies and displays them as cards. Public page.
 */

import { useState, useEffect } from 'react';
import { getMovies } from '../services/api';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getMovies();
        setMovies(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load movies.');
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
        <p>Loading movies...</p>
      </div>
    );
  }
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="page home-page">
      <section className="hero">
        <h1 className="hero-title">Book Your Favourite Movies</h1>
        <p className="hero-subtitle">Pick a movie, choose your showtime, and book seats in a few clicks.</p>
      </section>
      <section className="movies-section">
        <h2 className="section-title">Movies</h2>
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
        {movies.length === 0 && (
          <div className="empty-state">
            <p>No movies available right now. Check back later.</p>
          </div>
        )}
      </section>
    </div>
  );
}
