import React from 'react';
import { Link } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-overlay">
          <Link to={`/movie/${movie.id}`} className="btn btn-primary">
            Book Now
          </Link>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-meta">
          <span className="rating">⭐ {movie.rating}</span>
          <span className="duration">🕐 {movie.duration}</span>
        </div>
        <p className="genre">{movie.genre}</p>
        <p className="price">💵 From ₹{movie.price}/seat</p>
      </div>
    </div>
  );
};

export default MovieCard;
