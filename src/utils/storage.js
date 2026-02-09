// Initialize app with default data
export const initializeApp = () => {
  // Initialize admin if not exists
  if (!localStorage.getItem('admin')) {
    const admin = {
      id: 'admin',
      password: 'admin123'
    };
    localStorage.setItem('admin', JSON.stringify(admin));
  }

  // Initialize movies if not exists
  if (!localStorage.getItem('movies')) {
    const defaultMovies = [
      {
        id: '1',
        title: 'The Dark Knight',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500',
        genre: 'Action, Crime, Drama',
        duration: '152 min',
        rating: '9.0',
        price: 250,
        showTimings: ['10:00 AM', '2:00 PM', '6:00 PM', '9:30 PM'],
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.'
      },
      {
        id: '2',
        title: 'Inception',
        poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500',
        genre: 'Action, Sci-Fi, Thriller',
        duration: '148 min',
        rating: '8.8',
        price: 300,
        showTimings: ['11:00 AM', '3:00 PM', '7:00 PM', '10:00 PM'],
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.'
      },
      {
        id: '3',
        title: 'Interstellar',
        poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500',
        genre: 'Adventure, Drama, Sci-Fi',
        duration: '169 min',
        rating: '8.6',
        price: 350,
        showTimings: ['10:30 AM', '2:30 PM', '6:30 PM', '9:00 PM'],
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
      }
    ];
    localStorage.setItem('movies', JSON.stringify(defaultMovies));
  }

  // Initialize users array if not exists
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([]));
  }

  // Initialize bookings array if not exists
  if (!localStorage.getItem('bookings')) {
    localStorage.setItem('bookings', JSON.stringify([]));
  }
};

// User Management
export const registerUser = (userData) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userExists = users.find(u => u.email === userData.email);
  
  if (userExists) {
    return { success: false, message: 'User already exists' };
  }

  const newUser = {
    userId: Date.now().toString(),
    ...userData,
    bookedSeats: []
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return { success: true, user: newUser };
};

export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: 'Invalid credentials' };
};

export const loginAdmin = (id, password) => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  
  if (admin.id === id && admin.password === password) {
    localStorage.setItem('currentAdmin', JSON.stringify(admin));
    return { success: true };
  }
  return { success: false, message: 'Invalid admin credentials' };
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('currentUser'));
};

export const getCurrentAdmin = () => {
  return JSON.parse(localStorage.getItem('currentAdmin'));
};

export const logout = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('currentAdmin');
};

// Movie Management
export const getMovies = () => {
  return JSON.parse(localStorage.getItem('movies') || '[]');
};

export const getMovieById = (id) => {
  const movies = getMovies();
  return movies.find(m => m.id === id);
};

export const addMovie = (movieData) => {
  const movies = getMovies();
  const newMovie = {
    id: Date.now().toString(),
    ...movieData
  };
  movies.push(newMovie);
  localStorage.setItem('movies', JSON.stringify(movies));
  return newMovie;
};

export const updateMovie = (id, movieData) => {
  const movies = getMovies();
  const index = movies.findIndex(m => m.id === id);
  if (index !== -1) {
    movies[index] = { ...movies[index], ...movieData };
    localStorage.setItem('movies', JSON.stringify(movies));
    return true;
  }
  return false;
};

export const deleteMovie = (id) => {
  const movies = getMovies();
  const filtered = movies.filter(m => m.id !== id);
  localStorage.setItem('movies', JSON.stringify(filtered));
};

// Booking Management
export const createBooking = (bookingData) => {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const currentUser = getCurrentUser();
  
  // Check if seats are already booked
  const existingBooking = bookings.find(b => 
    b.movieId === bookingData.movieId && 
    b.showTime === bookingData.showTime &&
    b.seats.some(seat => bookingData.seats.includes(seat))
  );

  if (existingBooking) {
    return { success: false, message: 'Some seats are already booked' };
  }

  const newBooking = {
    id: Date.now().toString(),
    userId: currentUser.userId,
    userName: currentUser.name,
    userEmail: currentUser.email,
    ...bookingData,
    bookingDate: new Date().toISOString()
  };

  bookings.push(newBooking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  return { success: true, booking: newBooking };
};

// Calculate seat price based on row
export const calculateSeatPrice = (seat, basePrice) => {
  const row = seat.charAt(0);
  const priceMultipliers = {
    'A': 0.8,  // Front rows - cheaper
    'B': 0.9,
    'C': 1.0,  // Middle rows - standard price
    'D': 1.0,
    'E': 1.2,  // Back rows - premium
    'F': 1.2
  };
  return basePrice * (priceMultipliers[row] || 1.0);
};

export const calculateTotalPrice = (seats, basePrice) => {
  return seats.reduce((total, seat) => {
    return total + calculateSeatPrice(seat, basePrice);
  }, 0);
};

export const getUserBookings = (userId) => {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  return bookings.filter(b => b.userId === userId);
};

export const getAllBookings = () => {
  return JSON.parse(localStorage.getItem('bookings') || '[]');
};

export const getBookedSeats = (movieId, showTime) => {
  const bookings = getAllBookings();
  const relevantBookings = bookings.filter(b => 
    b.movieId === movieId && b.showTime === showTime
  );
  
  const bookedSeats = [];
  relevantBookings.forEach(booking => {
    bookedSeats.push(...booking.seats);
  });
  
  return bookedSeats;
};

export const cancelBooking = (bookingId) => {
  const bookings = getAllBookings();
  const filtered = bookings.filter(b => b.id !== bookingId);
  localStorage.setItem('bookings', JSON.stringify(filtered));
};

export const getAllUsers = () => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

// Coupon Management
export const getCoupons = () => {
  return JSON.parse(localStorage.getItem('coupons') || '[]');
};

export const addCoupon = (couponData) => {
  const coupons = getCoupons();
  const newCoupon = {
    id: Date.now().toString(),
    ...couponData,
    createdAt: new Date().toISOString()
  };
  coupons.push(newCoupon);
  localStorage.setItem('coupons', JSON.stringify(coupons));
  return newCoupon;
};

export const deleteCoupon = (id) => {
  const coupons = getCoupons();
  const filtered = coupons.filter(c => c.id !== id);
  localStorage.setItem('coupons', JSON.stringify(filtered));
};

export const validateCoupon = (code) => {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase() && c.active);
  
  if (!coupon) {
    return { valid: false, message: 'Invalid coupon code' };
  }
  
  const now = new Date();
  const expiryDate = new Date(coupon.expiryDate);
  
  if (now > expiryDate) {
    return { valid: false, message: 'Coupon has expired' };
  }
  
  if (coupon.usageCount >= coupon.maxUsage) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  
  return { valid: true, coupon };
};

export const applyCouponUsage = (code) => {
  const coupons = getCoupons();
  const couponIndex = coupons.findIndex(c => c.code.toLowerCase() === code.toLowerCase());
  
  if (couponIndex !== -1) {
    coupons[couponIndex].usageCount = (coupons[couponIndex].usageCount || 0) + 1;
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }
};

// Review Management
export const getReviews = (movieId) => {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  return reviews.filter(r => r.movieId === movieId);
};

export const addReview = (reviewData) => {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    return { success: false, message: 'Please login to add a review' };
  }

  // Check if user already reviewed this movie
  const existingReview = reviews.find(r => 
    r.movieId === reviewData.movieId && r.userId === currentUser.userId
  );

  if (existingReview) {
    return { success: false, message: 'You have already reviewed this movie' };
  }

  const newReview = {
    id: Date.now().toString(),
    userId: currentUser.userId,
    userName: currentUser.name,
    movieId: reviewData.movieId,
    rating: reviewData.rating,
    comment: reviewData.comment,
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);
  localStorage.setItem('reviews', JSON.stringify(reviews));
  return { success: true, review: newReview };
};

export const deleteReview = (reviewId) => {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
  const filtered = reviews.filter(r => r.id !== reviewId);
  localStorage.setItem('reviews', JSON.stringify(filtered));
};

export const getAverageRating = (movieId) => {
  const reviews = getReviews(movieId);
  if (reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};
