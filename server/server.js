const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/admin/movies', require('./routes/admin-movies'));
app.use('/api/admin/bookings', require('./routes/admin-bookings'));
app.use('/api/admin/users', require('./routes/admin-users'));
app.use('/api/admin/coupons', require('./routes/admin-coupons'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
