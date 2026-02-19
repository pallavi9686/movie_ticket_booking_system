const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5003/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API call failed');
    }

    return response.json();
  } catch (error) {
    // Check if it's a network error (server not running)
    if (error.message === 'Failed to fetch' || error.message.includes('fetch')) {
      console.error('❌ Server not available. Please start the backend server.');
      throw new Error('Server not available. Please start the backend server.');
    }
    // Otherwise, it's an API error - throw the actual error message
    throw error;
  }
};

// Auth APIs
export const registerUser = (userData) =>
  apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });

export const loginUser = (email, password) =>
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

export const loginAdmin = (username, password) =>
  apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });

// Movie APIs
export const getMovies = () => apiCall('/movies');

export const getMovieById = (id) => apiCall(`/movies/${id}`);

// Booking APIs
export const createBooking = (bookingData) =>
  apiCall('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });

export const getUserBookings = (userId) =>
  apiCall(`/bookings/user/${userId}`);

export const getBookedSeats = (movieId, showTime, showDate) =>
  apiCall(`/bookings/seats/${movieId}/${showTime}${showDate ? `/${showDate}` : ''}`);

export const cancelBooking = (bookingId) =>
  apiCall(`/bookings/${bookingId}`, {
    method: 'DELETE'
  });

// Coupon APIs
export const getCoupons = () => apiCall('/admin/coupons');

export const validateCoupon = (code) =>
  apiCall('/coupons/validate', {
    method: 'POST',
    body: JSON.stringify({ code })
  });

// Admin APIs
export const getAdminMovies = () => apiCall('/admin/movies');

export const addAdminMovie = (movieData) =>
  apiCall('/admin/movies', {
    method: 'POST',
    body: JSON.stringify(movieData)
  });

export const updateAdminMovie = (id, movieData) =>
  apiCall(`/admin/movies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(movieData)
  });

export const deleteAdminMovie = (id) =>
  apiCall(`/admin/movies/${id}`, {
    method: 'DELETE'
  });

export const getAdminUsers = () => apiCall('/admin/users');

export const getAdminBookings = () => apiCall('/admin/bookings');

export const cancelAdminBooking = (id) =>
  apiCall(`/admin/bookings/${id}`, {
    method: 'DELETE'
  });

export const getAdminCoupons = () => apiCall('/admin/coupons');

export const addAdminCoupon = (couponData) =>
  apiCall('/admin/coupons', {
    method: 'POST',
    body: JSON.stringify(couponData)
  });

export const deleteAdminCoupon = (id) =>
  apiCall(`/admin/coupons/${id}`, {
    method: 'DELETE'
  });


// Review APIs (placeholder - not implemented in backend yet)
export const getMovieReviews = (movieId) => {
  // Return empty array for now since reviews aren't implemented
  return Promise.resolve([]);
};

export const addReview = (reviewData) => {
  // Placeholder for future implementation
  return Promise.resolve({ success: true });
};

export const deleteReview = (id) => {
  // Placeholder for future implementation
  return Promise.resolve({ success: true });
};
