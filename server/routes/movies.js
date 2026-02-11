const express = require('express');
const pool = require('../config/database');

const router = express.Router();

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
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch movies' });
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
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

module.exports = router;
