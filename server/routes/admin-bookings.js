const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all bookings
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [bookings] = await connection.query(`
      SELECT b.*, m.title as movie_title, u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN movies m ON b.movie_id = m.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.booking_date DESC
    `);
    connection.release();
    
    const formattedBookings = bookings.map(b => ({
      ...b,
      seats: JSON.parse(b.seats)
    }));
    
    res.json(formattedBookings);
  } catch (error) {
    console.error('Database error:', error.message);
    // Return empty array when database is not available
    res.json([]);
  }
});

// Cancel booking
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM bookings WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
