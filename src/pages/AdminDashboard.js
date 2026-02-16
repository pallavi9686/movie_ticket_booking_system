import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminMovies,
  addAdminMovie,
  updateAdminMovie,
  deleteAdminMovie,
  getAdminUsers,
  getAdminBookings,
  cancelAdminBooking,
  getAdminCoupons,
  addAdminCoupon,
  deleteAdminCoupon
} from '../utils/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    poster: '',
    genre: '',
    duration: '',
    price: '',
    description: ''
  });
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_percentage: '',
    expiry_date: '',
    max_usage: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));

  useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin-login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const moviesData = await getAdminMovies();
      setMovies(moviesData);
      
      const usersData = await getAdminUsers();
      setUsers(usersData);
      
      const bookingsData = await getAdminBookings();
      setBookings(bookingsData);
      
      const couponsData = await getAdminCoupons();
      setCoupons(couponsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleMovieFormChange = (e) => {
    setMovieForm({ ...movieForm, [e.target.name]: e.target.value });
  };

  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await updateAdminMovie(editingMovie.id, movieForm);
        setMessage({ type: 'success', text: 'Movie updated successfully!' });
        setEditingMovie(null);
      } else {
        await addAdminMovie(movieForm);
        setMessage({ type: 'success', text: 'Movie added successfully!' });
      }
      setMovieForm({
        title: '',
        poster: '',
        genre: '',
        duration: '',
        price: '',
        description: ''
      });
      loadData();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      poster: movie.poster,
      genre: movie.genre,
      duration: movie.duration,
      price: movie.price || '',
      description: movie.description
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMovie = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await deleteAdminMovie(id);
        loadData();
        setMessage({ type: 'success', text: 'Movie deleted successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelAdminBooking(bookingId);
        loadData();
        setMessage({ type: 'success', text: 'Booking cancelled successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await addAdminCoupon(couponForm);
      setMessage({ type: 'success', text: 'Coupon created successfully!' });
      setCouponForm({
        code: '',
        discount_percentage: '',
        expiry_date: '',
        max_usage: ''
      });
      loadData();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteAdminCoupon(id);
        loadData();
        setMessage({ type: 'success', text: 'Coupon deleted successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        setMessage({ type: 'error', text: error.message });
      }
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

        {loading && <p className="loading">Loading...</p>}

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
                  <label>Base Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={movieForm.price}
                    onChange={handleMovieFormChange}
                    placeholder="e.g., 250"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
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
                      price: '',
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
            <h2>All Users ({users.length})</h2>
            <div className="data-table">
              {users.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
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
            <h2>All Bookings ({bookings.length})</h2>
            <div className="data-table">
              {bookings.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>User Name</th>
                      <th>Movie</th>
                      <th>Theater</th>
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
                        <td>{booking.user_name}</td>
                        <td>{booking.movie_title}</td>
                        <td>{booking.theaterName || 'N/A'}</td>
                        <td>{booking.show_time}</td>
                        <td>{booking.seats.join(', ')}</td>
                        <td>₹{booking.total_price ? parseFloat(booking.total_price).toFixed(2) : 'N/A'}</td>
                        <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
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
                    name="discount_percentage"
                    value={couponForm.discount_percentage}
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
                    name="expiry_date"
                    value={couponForm.expiry_date}
                    onChange={handleCouponFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Max Usage</label>
                  <input
                    type="number"
                    name="max_usage"
                    value={couponForm.max_usage}
                    onChange={handleCouponFormChange}
                    placeholder="e.g., 100"
                    min="1"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Create Coupon
              </button>
            </form>

            <h2>All Coupons ({coupons.length})</h2>
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(coupon => {
                      const isExpired = new Date(coupon.expiry_date) < new Date();
                      const isMaxed = coupon.usage_count >= coupon.max_usage;
                      return (
                        <tr key={coupon.id}>
                          <td><strong>{coupon.code}</strong></td>
                          <td>{coupon.discount_percentage}%</td>
                          <td>{new Date(coupon.expiry_date).toLocaleDateString()}</td>
                          <td>{coupon.usage_count || 0} / {coupon.max_usage}</td>
                          <td>
                            {isExpired ? '❌ Expired' : isMaxed ? '⚠️ Max Used' : '✅ Active'}
                          </td>
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
