import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { getMovies } from '../utils/storage';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const allMovies = getMovies();
    setMovies(allMovies);
    
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const filtered = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(allMovies);
    }
  }, [searchParams]);

  const searchQuery = searchParams.get('search');

  return (
    <div className="movies-page">
      <div className="container">
        <h1 className="page-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Now Showing'}
        </h1>
        <div className="movies-grid">
          {filteredMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        {filteredMovies.length === 0 && (
          <p className="no-movies">
            {searchQuery ? `No movies found for "${searchQuery}"` : 'No movies available at the moment.'}
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Movies;
