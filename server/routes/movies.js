const express = require('express');
const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Fallback movies data
const getFallbackMovies = () => {
  try {
    const moviesPath = path.join(__dirname, '../../src/data/movies.json');
    const moviesData = fs.readFileSync(moviesPath, 'utf8');
    const movies = JSON.parse(moviesData);
    
    // Transform to match expected format
    return movies.map(movie => ({
      id: parseInt(movie.id),
      title: movie.title,
      poster: movie.poster,
      genre: movie.genre,
      duration: movie.duration,
      rating: parseFloat(movie.rating),
      price: 15.00,
      description: movie.description,
      showTimings: movie.showtimes || ['10:00 AM', '2:00 PM', '6:00 PM', '9:30 PM']
    }));
  } catch (err) {
    console.error('Error reading fallback movies:', err);
    return [];
  }
};

// Get all movies
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [movies] = await connection.query('SELECT * FROM movies');
    
    // Get show timings for each movie
    for (let movie of movies) {
      const [timings] = await connection.query(
        'SELECT timing FROM show_timings WHERE movie_id = ?',
        [movie.id]
      );
      movie.showTimings = timings.map(t => t.timing);
    }
    
    connection.release();
    res.json(movies);
  } catch (error) {
    console.error('Database error, using fallback data:', error.message);
    // Use fallback data when database is not available
    const fallbackMovies = getFallbackMovies();
    res.json(fallbackMovies);
  }
});

// Get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    const [movies] = await connection.query('SELECT * FROM movies WHERE id = ?', [id]);
    
    if (movies.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Movie not found' });
    }

    const movie = movies[0];
    const [timings] = await connection.query(
      'SELECT timing FROM show_timings WHERE movie_id = ?',
      [id]
    );
    movie.showTimings = timings.map(t => t.timing);
    
    connection.release();
    res.json(movie);
  } catch (error) {
    console.error('Database error, using fallback data:', error.message);
    // Use fallback data when database is not available
    const fallbackMovies = getFallbackMovies();
    const movie = fallbackMovies.find(m => m.id === parseInt(id));
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    res.json(movie);
  }
});

module.exports = router;
