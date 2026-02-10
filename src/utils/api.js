// API utility for future backend integration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Movies API
  static async getMovies() {
    return this.request('/movies');
  }

  static async getMovie(id) {
    return this.request(`/movies/${id}`);
  }

  static async createMovie(movieData) {
    return this.request('/movies', {
      method: 'POST',
      body: JSON.stringify(movieData),
    });
  }

  static async updateMovie(id, movieData) {
    return this.request(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData),
    });
  }

  static async deleteMovie(id) {
    return this.request(`/movies/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings API
  static async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  static async getUserBookings(userId) {
    return this.request(`/bookings/user/${userId}`);
  }

  static async getAllBookings() {
    return this.request('/bookings');
  }

  static async getBookedSeats(movieId, showTime) {
    return this.request(`/bookings/seats/${movieId}/${showTime}`);
  }

  static async cancelBooking(bookingId) {
    return this.request(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  // Auth API
  static async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async adminLogin(credentials) {
    return this.request('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Coupons API
  static async getCoupons() {
    return this.request('/coupons');
  }

  static async createCoupon(couponData) {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  }

  static async validateCoupon(code) {
    return this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  static async deleteCoupon(id) {
    return this.request(`/coupons/${id}`, {
      method: 'DELETE',
    });
  }
}

export default ApiService;