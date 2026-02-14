const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all coupons (public endpoint for displaying offers)
router.get('/', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [coupons] = await connection.query('SELECT * FROM coupons WHERE active = TRUE');
    connection.release();
    res.json(coupons);
  } catch (error) {
    console.error('Database error:', error.message);
    // Return empty array when database is not available
    res.json([]);
  }
});

// Add coupon
router.post('/', verifyToken, async (req, res) => {
  try {
    const { code, discount_percentage, discount_amount, max_usage, expiry_date } = req.body;

    if (!code || !expiry_date || !max_usage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO coupons (code, discount_percentage, discount_amount, max_usage, expiry_date, active) VALUES (?, ?, ?, ?, ?, TRUE)',
      [code.toUpperCase(), discount_percentage || null, discount_amount || null, max_usage, expiry_date]
    );
    connection.release();

    res.status(201).json({ id: result.insertId, message: 'Coupon created successfully' });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(503).json({ error: 'Database not available. Cannot create coupons without database.' });
  }
});

// Delete coupon
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.query('DELETE FROM coupons WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(503).json({ error: 'Database not available. Cannot delete coupons without database.' });
  }
});

module.exports = router;
