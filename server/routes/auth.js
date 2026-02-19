const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/database');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const connection = await pool.getConnection();
      
      // Check if user exists
      const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      await connection.query(
        'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, phone || null]
      );

      connection.release();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (dbError) {
      console.error('Database error:', dbError.message);
      res.status(503).json({ error: 'Registration is currently unavailable. Please try again later or contact support.' });
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    try {
      const connection = await pool.getConnection();
      const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
      connection.release();

      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '24h'
      });

      res.json({
        token,
        user: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError.message);
      res.status(503).json({ error: 'Login is currently unavailable. Please try again later or use Admin Login.' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;

// Forgot Password - Request reset token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const connection = await pool.getConnection();
    
    // Check if user exists
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      connection.release();
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If the email exists, a reset code has been sent' });
    }

    const user = users[0];
    
    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedToken = crypto.createHash('sha256').update(resetCode).digest('hex');
    
    // Token expires in 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    
    // Store reset token
    await connection.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, hashedToken, expiresAt]
    );
    
    connection.release();
    
    // In production, send this via email
    // For development, return it in response
    console.log(`Password reset code for ${email}: ${resetCode}`);
    
    res.json({ 
      message: 'If the email exists, a reset code has been sent',
      // Remove this in production - only for development
      resetCode: resetCode
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Verify Reset Code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const connection = await pool.getConnection();
    
    // Get user
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'Invalid code' });
    }

    const user = users[0];
    const hashedToken = crypto.createHash('sha256').update(code).digest('hex');
    
    // Check if token exists and is valid
    const [tokens] = await connection.query(
      'SELECT * FROM password_resets WHERE user_id = ? AND token = ? AND expires_at > NOW() AND used = FALSE ORDER BY created_at DESC LIMIT 1',
      [user.id, hashedToken]
    );
    
    connection.release();
    
    if (tokens.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }
    
    res.json({ message: 'Code verified successfully', valid: true });
  } catch (error) {
    console.error('Verify code error:', error.message);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const connection = await pool.getConnection();
    
    // Get user
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'Invalid request' });
    }

    const user = users[0];
    const hashedToken = crypto.createHash('sha256').update(code).digest('hex');
    
    // Check if token exists and is valid
    const [tokens] = await connection.query(
      'SELECT * FROM password_resets WHERE user_id = ? AND token = ? AND expires_at > NOW() AND used = FALSE ORDER BY created_at DESC LIMIT 1',
      [user.id, hashedToken]
    );
    
    if (tokens.length === 0) {
      connection.release();
      return res.status(400).json({ error: 'Invalid or expired code' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await connection.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);
    
    // Mark token as used
    await connection.query('UPDATE password_resets SET used = TRUE WHERE id = ?', [tokens[0].id]);
    
    connection.release();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});
