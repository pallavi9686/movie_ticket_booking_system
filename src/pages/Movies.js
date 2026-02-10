import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { getMovies } from '../utils/api';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const allMovies = await getMovies();
        setMovies(allMovies);
        
        if (searchQuery.trim()) {
          const filtered = allMovies.filter(movie =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredMovies(filtered);
        } else {
          setFilteredMovies(allMovies);
        }
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch movies:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [searchQuery]);

  const displayMovies = filteredMovies;

  if (loading) {
    return (
      <div className="movies-page">
        <div className="container">
          <p className="loading">Loading movies...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="movies-page">
        <div className="container">
          <p className="error">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="container">
        <h1 className="page-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Now Showing'}
        </h1>
        <div className="movies-grid">
          {displayMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {displayMovies.length === 0 && (
          <p className="no-movies">
            {searchQuery ? 'No movies found matching your search.' : 'No movies available at the moment.'}
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
