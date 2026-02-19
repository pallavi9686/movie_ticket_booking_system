const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/', verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT id, name, email, phone, created_at FROM users');
    connection.release();
    res.json(users);
  } catch (error) {
    console.error('Database error:', error.message);
    // Return empty array when database is not available
    res.json([]);
  }
});

module.exports = router;
