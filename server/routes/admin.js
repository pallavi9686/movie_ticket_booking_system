const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

// Fallback admin credentials (username: admin, password: admin123)
const FALLBACK_ADMIN = {
  id: 1,
  username: 'admin',
  password: '$2a$10$YQiC8xZ5Z5Z5Z5Z5Z5Z5Z.YQiC8xZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5' // This will be replaced with actual hash
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    let admin = null;
    let validPassword = false;

    try {
      // Try database first
      const connection = await pool.getConnection();
      const [admins] = await connection.query('SELECT * FROM admin WHERE username = ?', [username]);
      connection.release();

      if (admins.length > 0) {
        admin = admins[0];
        validPassword = await bcrypt.compare(password, admin.password);
      }
    } catch (dbError) {
      console.log('Database not available, using fallback admin credentials');
      
      // Use fallback credentials when database is not available
      if (username === 'admin' && password === 'admin123') {
        admin = FALLBACK_ADMIN;
        validPassword = true;
      }
    }

    if (!admin || !validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ adminId: admin.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '24h'
    });

    res.json({ token, admin: { id: admin.id, username: admin.username } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
