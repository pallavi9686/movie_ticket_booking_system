import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import { getMovies } from '../utils/storage';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(getMovies());
  }, []);

  return (
    <div className="movies-page">
      <div className="container">
        <h1 className="page-title">Now Showing</h1>
        <div className="movies-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {movies.length === 0 && (
          <p className="no-movies">No movies available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
