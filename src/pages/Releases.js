import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { getMovies } from '../utils/storage';
import './Releases.css';

const Releases = () => {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all'); // all, upcoming, recent

  useEffect(() => {
    const allMovies = getMovies();
    setMovies(allMovies);
  }, []);

  const getFilteredMovies = () => {
    // For demo purposes, we'll show all movies
    // In a real app, you'd filter by release date
    return movies;
  };

  return (
    <div className="releases-page">
      <div className="container">
        <div className="releases-header">
          <h1 className="page-title">Movie Releases</h1>
          <p className="page-subtitle">Discover the latest and upcoming movies</p>
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Releases
          </button>
          <button
            className={`filter-btn ${filter === 'recent' ? 'active' : ''}`}
            onClick={() => setFilter('recent')}
          >
            Recent Releases
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Coming Soon
          </button>
        </div>

        <div className="releases-grid">
          {getFilteredMovies().map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {movies.length === 0 && (
          <p className="no-movies">No releases available at the moment.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Releases;
