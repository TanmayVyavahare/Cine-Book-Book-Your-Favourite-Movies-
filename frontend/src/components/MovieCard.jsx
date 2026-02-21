/**
 * MovieCard.jsx - Poster 300px, genre badge top-left, gold rating top-right, hover overlay "Book Now"
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false);
  const showPoster = movie.poster && !imgError;

  return (
    <Link to={`/movie/${movie._id}`} className="movie-card">
      <div className="movie-card-poster">
        {showPoster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="movie-card-placeholder">{movie.title?.charAt(0)}</div>
        )}
        {movie.genre && (
          <span className="movie-card-genre">{movie.genre}</span>
        )}
        {movie.rating > 0 && (
          <span className="movie-card-rating" aria-label={`Rating ${movie.rating}`}>
            ★ {movie.rating}
          </span>
        )}
        <div className="movie-card-overlay">
          <span className="btn">Book Now</span>
        </div>
      </div>
      <div className="movie-card-info">
        <h3>{movie.title}</h3>
        {movie.genre && <span className="genre">{movie.genre}</span>}
      </div>
    </Link>
  );
}
