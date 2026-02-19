import React, { useState, useEffect } from 'react';
import { getMovies } from '../utils/api';
import MovieCard from '../components/MovieCard';
import './Releases.css';

const Releases = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, recent
  const [sortBy, setSortBy] = useState('latest'); // latest, rating, title

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const getFilteredMovies = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    let filtered = [...movies];

    switch (filter) {
      case 'recent':
        filtered = movies.filter(movie => {
          const releaseDate = new Date(movie.created_at);
          return releaseDate >= thirtyDaysAgo && releaseDate <= now;
        });
        break;
      case 'upcoming':
        filtered = movies.filter(movie => {
          const releaseDate = new Date(movie.created_at);
          return releaseDate > now && releaseDate <= thirtyDaysFromNow;
        });
        break;
      default:
        filtered = movies;
    }

    // Sort movies
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'latest':
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return filtered;
  };

  const filteredMovies = getFilteredMovies();

  if (loading) {
    return (
      <div className="releases-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading amazing movies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="releases-page">
      {/* Hero Section */}
      <div className="releases-hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-icon">🎬</span>
            Movie Releases
          </h1>
          <p className="hero-subtitle">Discover the latest blockbusters and upcoming premieres</p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{movies.length}</span>
              <span className="stat-label">Total Movies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{filteredMovies.length}</span>
              <span className="stat-label">Showing Now</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Filter Section */}
        <div className="controls-section">
          <div className="filter-group">
            <h3 className="control-label">Filter by Release</h3>
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <span className="tab-icon">🎥</span>
                All Movies
              </button>
              <button
                className={`filter-tab ${filter === 'recent' ? 'active' : ''}`}
                onClick={() => setFilter('recent')}
              >
                <span className="tab-icon">🔥</span>
                Recent Releases
              </button>
              <button
                className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilter('upcoming')}
              >
                <span className="tab-icon">⭐</span>
                Coming Soon
              </button>
            </div>
          </div>

          <div className="sort-group">
            <h3 className="control-label">Sort by</h3>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>
            Showing <strong>{filteredMovies.length}</strong> {filteredMovies.length === 1 ? 'movie' : 'movies'}
          </p>
        </div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <div className="movies-grid">
            {filteredMovies.map((movie, index) => (
              <div 
                key={movie.id} 
                className="movie-card-wrapper"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-movies">
            <div className="no-movies-icon">🎬</div>
            <h3>No Movies Found</h3>
            <p>Try adjusting your filters to see more results</p>
            <button 
              className="btn btn-primary"
              onClick={() => setFilter('all')}
            >
              View All Movies
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Releases;
