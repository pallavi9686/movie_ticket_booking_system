import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getCurrentAdmin,
  getMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getAllUsers,
  getAllBookings,
  cancelBooking,
  getMovieById,
  getCoupons,
  addCoupon,
  deleteCoupon
} from '../utils/storage';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    poster: '',
    genre: '',
    duration: '',
    rating: '',
    price: '',
    showTimings: '',
    description: ''
  });
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: '',
    expiryDate: '',
    maxUsage: '',
    description: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const currentAdmin = getCurrentAdmin();

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin-login');
      return;
    }
    loadData();
  }, [currentAdmin, navigate]);

  const loadData = () => {
    setMovies(getMovies());
    setUsers(getAllUsers());
    setCoupons(getCoupons());
    const allBookings = getAllBookings();
    const bookingsWithMovies = allBookings.map(booking => ({
      ...booking,
      movie: getMovieById(booking.movieId)
    }));
    setBookings(bookingsWithMovies);
  };

  const handleMovieFormChange = (e) => {
    setMovieForm({ ...movieForm, [e.target.name]: e.target.value });
  };

  const handleAddMovie = (e) => {
    e.preventDefault();
    const movieData = {
      ...movieForm,
      showTimings: movieForm.showTimings.split(',').map(t => t.trim())
    };

    if (editingMovie) {
      updateMovie(editingMovie.id, movieData);
      setMessage({ type: 'success', text: 'Movie updated successfully!' });
      setEditingMovie(null);
    } else {
      addMovie(movieData);
      setMessage({ type: 'success', text: 'Movie added successfully!' });
    }

    setMovieForm({
      title: '',
      poster: '',
      genre: '',
      duration: '',
      rating: '',
      price: '',
      showTimings: '',
      description: ''
    });
    loadData();
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      poster: movie.poster,
      genre: movie.genre,
      duration: movie.duration,
      rating: movie.rating,
      price: movie.price || '',
      showTimings: movie.showTimings.join(', '),
      description: movie.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMovie = (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      deleteMovie(id);
      loadData();
      setMessage({ type: 'success', text: 'Movie deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
      loadData();
      setMessage({ type: 'success', text: 'Booking cancelled successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    const couponData = {
      ...couponForm,
      discount: parseFloat(couponForm.discount),
      maxUsage: parseInt(couponForm.maxUsage),
      usageCount: 0,
      active: true
    };

    addCoupon(couponData);
    setMessage({ type: 'success', text: 'Coupon created successfully!' });
    setCouponForm({
      code: '',
      discount: '',
      expiryDate: '',
      maxUsage: '',
      description: ''
    });
    loadData();
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      deleteCoupon(id);
      loadData();
      setMessage({ type: 'success', text: 'Coupon deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleCouponFormChange = (e) => {
    setCouponForm({ ...couponForm, [e.target.name]: e.target.value });
  };

  if (!currentAdmin) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            Manage Movies
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            View Users
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            View Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'coupons' ? 'active' : ''}`}
            onClick={() => setActiveTab('coupons')}
          >
            Manage Coupons
          </button>
        </div>

        {message.text && (
          <div className={`${message.type}-message`}>
            {message.text}
          </div>
        )}

        {activeTab === 'movies' && (
          <div className="admin-section">
            <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
            <form onSubmit={handleAddMovie} className="movie-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Movie Title</label>
                  <input
                    type="text"
                    name="title"
                    value={movieForm.title}
                    onChange={handleMovieFormChange}
                    placeholder="Enter movie title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Poster URL</label>
                  <input
                    type="url"
                    name="poster"
                    value={movieForm.poster}
                    onChange={handleMovieFormChange}
                    placeholder="Enter poster image URL"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={movieForm.genre}
                    onChange={handleMovieFormChange}
                    placeholder="e.g., Action, Drama"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={movieForm.duration}
                    onChange={handleMovieFormChange}
                    placeholder="e.g., 120 min"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="text"
                    name="rating"
                    value={movieForm.rating}
                    onChange={handleMovieFormChange}
                    placeholder="e.g., 8.5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Base Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={movieForm.price}
                    onChange={handleMovieFormChange}
                    placeholder="e.g., 15"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Show Timings (comma separated)</label>
                <input
                  type="text"
                  name="showTimings"
                  value={movieForm.showTimings}
                  onChange={handleMovieFormChange}
                  placeholder="e.g., 10:00 AM, 2:00 PM, 6:00 PM"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={movieForm.description}
                  onChange={handleMovieFormChange}
                  placeholder="Enter movie description"
                  rows="4"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {editingMovie ? 'Update Movie' : 'Add Movie'}
              </button>
              {editingMovie && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingMovie(null);
                    setMovieForm({
                      title: '',
                      poster: '',
                      genre: '',
                      duration: '',
                      rating: '',
                      price: '',
                      showTimings: '',
                      description: ''
                    });
                  }}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel Edit
                </button>
              )}
            </form>

            <h2>All Movies</h2>
            <div className="admin-movies-grid">
              {movies.map(movie => (
                <div key={movie.id} className="admin-movie-card">
                  <img src={movie.poster} alt={movie.title} />
                  <div className="admin-movie-info">
                    <h3>{movie.title}</h3>
                    <p>Genre: {movie.genre}</p>
                    <p>Duration: {movie.duration}</p>
                    <p>Rating: ⭐ {movie.rating}</p>
                    <p>Price: ₹{movie.price}/seat</p>
                    <div className="admin-movie-actions">
                      <button
                        onClick={() => handleEditMovie(movie)}
                        className="btn btn-secondary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(movie.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>All Users</h2>
            <div className="data-table">
              {users.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">No users registered yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="admin-section">
            <h2>All Bookings</h2>
            <div className="data-table">
              {bookings.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User Name</th>
                      <th>Movie</th>
                      <th>Show Time</th>
                      <th>Seats</th>
                      <th>Total Price</th>
                      <th>Booking Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.userName}</td>
                        <td>{booking.movieTitle}</td>
                        <td>{booking.showTime}</td>
                        <td>{booking.seats.join(', ')}</td>
                        <td>${booking.totalPrice ? booking.totalPrice.toFixed(2) : 'N/A'}</td>
                        <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="btn btn-danger"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">No bookings yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'coupons' && (
          <div className="admin-section">
            <h2>Create New Coupon</h2>
            <form onSubmit={handleAddCoupon} className="movie-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Coupon Code</label>
                  <input
                    type="text"
                    name="code"
                    value={couponForm.code}
                    onChange={handleCouponFormChange}
                    placeholder="e.g., SAVE20"
                    required
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={couponForm.discount}
                    onChange={handleCouponFormChange}
                    placeholder="e.g., 20"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={couponForm.expiryDate}
                    onChange={handleCouponFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Usage</label>
                  <input
                    type="number"
                    name="maxUsage"
                    value={couponForm.maxUsage}
                    onChange={handleCouponFormChange}
                    placeholder="e.g., 100"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={couponForm.description}
                  onChange={handleCouponFormChange}
                  placeholder="e.g., Get 20% off on all bookings"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Create Coupon
              </button>
            </form>

            <h2>All Coupons</h2>
            <div className="data-table">
              {coupons.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Expiry Date</th>
                      <th>Usage</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(coupon => {
                      const isExpired = new Date(coupon.expiryDate) < new Date();
                      const isMaxed = coupon.usageCount >= coupon.maxUsage;
                      return (
                        <tr key={coupon.id}>
                          <td><strong>{coupon.code}</strong></td>
                          <td>{coupon.discount}%</td>
                          <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                          <td>{coupon.usageCount || 0} / {coupon.maxUsage}</td>
                          <td>
                            {isExpired ? '❌ Expired' : isMaxed ? '⚠️ Max Used' : '✅ Active'}
                          </td>
                          <td>{coupon.description}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="no-data">No coupons created yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
