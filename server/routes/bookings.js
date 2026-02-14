const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', verifyToken, async (req, res) => {
  try {
    const { movieId, showDate, showTime, seats, totalPrice } = req.body;
    const userId = req.userId;

    if (!movieId || !showDate || !showTime || !seats || !totalPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();

    // Check if seats are already booked
    const [existingBookings] = await connection.query(
      'SELECT * FROM bookings WHERE movie_id = ? AND show_date = ? AND show_time = ?',
      [movieId, showDate, showTime]
    );

    for (let booking of existingBookings) {
      const bookedSeats = JSON.parse(booking.seats);
      const conflict = seats.some(seat => bookedSeats.includes(seat));
      if (conflict) {
        connection.release();
        return res.status(400).json({ error: 'Some seats are already booked' });
      }
    }

    // Create booking
    await connection.query(
      'INSERT INTO bookings (user_id, movie_id, show_date, show_time, seats, total_price) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, movieId, showDate, showTime, JSON.stringify(seats), totalPrice]
    );

    connection.release();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Booking failed' });
  }
});

// Get user bookings
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const connection = await pool.getConnection();

    const [bookings] = await connection.query(
      'SELECT * FROM bookings WHERE user_id = ? ORDER BY booking_date DESC',
      [userId]
    );

    const formattedBookings = bookings.map(b => ({
      ...b,
      seats: JSON.parse(b.seats)
    }));

    connection.release();
    res.json(formattedBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get booked seats for a movie and show time
router.get('/seats/:movieId/:showTime/:showDate?', async (req, res) => {
  try {
    const { movieId, showTime, showDate } = req.params;
    const connection = await pool.getConnection();

    let query = 'SELECT seats FROM bookings WHERE movie_id = ? AND show_time = ?';
    let params = [movieId, showTime];

    if (showDate) {
      query += ' AND show_date = ?';
      params.push(showDate);
    }

    const [bookings] = await connection.query(query, params);

    const bookedSeats = [];
    bookings.forEach(b => {
      bookedSeats.push(...JSON.parse(b.seats));
    });

    connection.release();
    res.json({ bookedSeats });
  } catch (error) {
    console.error('Database error:', error.message);
    // Return empty booked seats when database is not available
    res.json({ bookedSeats: [] });
  }
});

// Cancel booking
router.delete('/:bookingId', verifyToken, async (req, res) => {
  try {
    const { bookingId } = req.params;
    const connection = await pool.getConnection();

    await connection.query('DELETE FROM bookings WHERE id = ?', [bookingId]);

    connection.release();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
