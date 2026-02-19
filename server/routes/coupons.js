const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Validate coupon
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Coupon code required' });
    }

    const connection = await pool.getConnection();
    const [coupons] = await connection.query(
      'SELECT * FROM coupons WHERE code = ? AND active = TRUE',
      [code.toUpperCase()]
    );

    if (coupons.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'Invalid coupon code' });
    }

    const coupon = coupons[0];
    const now = new Date();
    const expiryDate = new Date(coupon.expiry_date);

    if (now > expiryDate) {
      connection.release();
      return res.status(400).json({ error: 'Coupon has expired' });
    }

    if (coupon.usage_count >= coupon.max_usage) {
      connection.release();
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }

    connection.release();
    res.json({ valid: true, coupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

module.exports = router;
