// Validation utilities for theatre management

export const validateMovie = (movieData) => {
  const errors = {};

  if (!movieData.title?.trim()) {
    errors.title = 'Movie title is required';
  }

  if (!movieData.poster?.trim()) {
    errors.poster = 'Movie poster URL is required';
  } else if (!isValidUrl(movieData.poster)) {
    errors.poster = 'Please enter a valid poster URL';
  }

  if (!movieData.genre?.trim()) {
    errors.genre = 'Genre is required';
  }

  if (!movieData.duration?.trim()) {
    errors.duration = 'Duration is required';
  }

  if (!movieData.price || movieData.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (!movieData.showTimings?.length) {
    errors.showTimings = 'At least one show timing is required';
  }

  if (!movieData.description?.trim()) {
    errors.description = 'Description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBooking = (bookingData) => {
  const errors = {};

  if (!bookingData.movieId) {
    errors.movieId = 'Movie selection is required';
  }

  if (!bookingData.showDate) {
    errors.showDate = 'Show date is required';
  }

  if (!bookingData.showTime) {
    errors.showTime = 'Show time is required';
  }

  if (!bookingData.seats?.length) {
    errors.seats = 'At least one seat must be selected';
  }

  if (bookingData.seats?.length > 10) {
    errors.seats = 'Maximum 10 seats can be booked at once';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCoupon = (couponData) => {
  const errors = {};

  if (!couponData.code?.trim()) {
    errors.code = 'Coupon code is required';
  } else if (couponData.code.length < 3) {
    errors.code = 'Coupon code must be at least 3 characters';
  }

  if (!couponData.discount || couponData.discount <= 0 || couponData.discount > 100) {
    errors.discount = 'Discount must be between 1 and 100';
  }

  if (!couponData.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else if (new Date(couponData.expiryDate) <= new Date()) {
    errors.expiryDate = 'Expiry date must be in the future';
  }

  if (!couponData.maxUsage || couponData.maxUsage <= 0) {
    errors.maxUsage = 'Max usage must be greater than 0';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateUser = (userData) => {
  const errors = {};

  if (!userData.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!userData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(userData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!userData.password) {
    errors.password = 'Password is required';
  } else if (userData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!userData.phone?.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!isValidPhone(userData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Helper functions
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Seat validation
export const validateSeatSelection = (seats, bookedSeats) => {
  const errors = {};

  if (!seats.length) {
    errors.seats = 'Please select at least one seat';
  }

  const conflictingSeats = seats.filter(seat => bookedSeats.includes(seat));
  if (conflictingSeats.length > 0) {
    errors.seats = `Seats ${conflictingSeats.join(', ')} are already booked`;
  }

  if (seats.length > 10) {
    errors.seats = 'Maximum 10 seats can be selected';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Payment validation
export const validatePayment = (paymentData) => {
  const errors = {};

  if (!paymentData.method) {
    errors.method = 'Payment method is required';
  }

  if (paymentData.method === 'card') {
    if (!paymentData.cardNumber?.replace(/\s/g, '')) {
      errors.cardNumber = 'Card number is required';
    } else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = 'Card number must be 16 digits';
    }

    if (!paymentData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    }

    if (!paymentData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length !== 3) {
      errors.cvv = 'CVV must be 3 digits';
    }

    if (!paymentData.cardholderName?.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }
  }

  if (paymentData.method === 'upi' && !paymentData.upiId?.trim()) {
    errors.upiId = 'UPI ID is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};