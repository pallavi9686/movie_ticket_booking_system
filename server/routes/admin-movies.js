const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all movies (no auth needed)
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

// Add movie (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, poster, genre, duration, rating, price, description, showTimings } = req.body;

    if (!title || !poster || !genre || !duration || !rating || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO movies (title, poster, genre, duration, rating, price, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, poster, genre, duration, rating, price, description]
    );

    const movieId = result.insertId;

    // Add default show timings if not provided
    const timings = showTimings && showTimings.length > 0 
      ? showTimings 
      : ['10:00 AM', '2:00 PM', '6:00 PM', '9:30 PM'];

    for (let timing of timings) {
      await connection.query(
        'INSERT INTO show_timings (movie_id, timing) VALUES (?, ?)',
        [movieId, timing]
      );
    }

    connection.release();
    res.status(201).json({ id: movieId, message: 'Movie added successfully with show timings' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add movie' });
  }
});

// Update movie (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, poster, genre, duration, rating, price, description, showTimings } = req.body;

    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE movies SET title = ?, poster = ?, genre = ?, duration = ?, rating = ?, price = ?, description = ? WHERE id = ?',
      [title, poster, genre, duration, rating, price, description, id]
    );

    // Update show timings if provided
    if (showTimings && showTimings.length > 0) {
      // Delete old timings
      await connection.query('DELETE FROM show_timings WHERE movie_id = ?', [id]);
      
      // Add new timings
      for (let timing of showTimings) {
        await connection.query(
          'INSERT INTO show_timings (movie_id, timing) VALUES (?, ?)',
          [id, timing]
        );
      }
    }

    connection.release();
    res.json({ message: 'Movie updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update movie' });
  }
});

// Delete movie (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    
    // Delete show timings first
    await connection.query('DELETE FROM show_timings WHERE movie_id = ?', [id]);
    
    // Delete movie
    await connection.query('DELETE FROM movies WHERE id = ?', [id]);
    
    connection.release();
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete movie' });
  }
});

module.exports = router;
