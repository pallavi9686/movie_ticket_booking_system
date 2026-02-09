import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatLayout from '../components/SeatLayout';
import { getMovieById, createBooking, getBookedSeats, getCurrentUser, calculateTotalPrice, validateCoupon, applyCouponUsage, getReviews, addReview, deleteReview, getAverageRating } from '../utils/storage';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowTime, setSelectedShowTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [averageRating, setAverageRating] = useState(0);
  const currentUser = getCurrentUser();

  // Generate next 7 days for date selection
  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatDateValue = (date) => {
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const movieData = getMovieById(id);
    if (movieData) {
      setMovie(movieData);
      // Set default date to today
      const today = new Date();
      setSelectedDate(formatDateValue(today));
      if (movieData.showTimings.length > 0) {
        setSelectedShowTime(movieData.showTimings[0]);
      }
    }
    // Load reviews
    loadReviews();
  }, [id]);

  const loadReviews = () => {
    const movieReviews = getReviews(id);
    setReviews(movieReviews);
    const avgRating = getAverageRating(id);
    setAverageRating(avgRating);
  };

  useEffect(() => {
    if (movie && selectedShowTime && selectedDate) {
      const booked = getBookedSeats(movie.id, `${selectedDate}-${selectedShowTime}`);
      setBookedSeats(booked);
      setSelectedSeats([]);
    }
  }, [movie, selectedShowTime, selectedDate]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    const result = validateCoupon(couponCode);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
      setMessage({ type: 'success', text: `Coupon applied! ${result.coupon.discount}% off` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setMessage({ type: 'success', text: 'Coupon removed' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const calculateFinalAmount = () => {
    const totalPrice = calculateTotalPrice(selectedSeats, movie.price);
    if (appliedCoupon) {
      const discount = (totalPrice * appliedCoupon.discount) / 100;
      return { totalPrice, discount, finalAmount: totalPrice - discount };
    }
    return { totalPrice, discount: 0, finalAmount: totalPrice };
  };

  const handleProceedToPayment = () => {
    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please login to book tickets' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (selectedSeats.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one seat' });
      return;
    }

    setShowPayment(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!currentUser) {
      setMessage({ type: 'error', text: 'Please login to submit a review' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (!newReview.comment.trim()) {
      setMessage({ type: 'error', text: 'Please write a comment' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    const result = addReview({
      movieId: id,
      rating: newReview.rating,
      comment: newReview.comment
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Review submitted successfully!' });
      setNewReview({ rating: 5, comment: '' });
      loadReviews();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview(reviewId);
      loadReviews();
      setMessage({ type: 'success', text: 'Review deleted successfully' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };


  const handlePayment = (e) => {
    e.preventDefault();

    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        setMessage({ type: 'error', text: 'Please fill all card details' });
        return;
      }
    }

    const { totalPrice, discount, finalAmount } = calculateFinalAmount();
    const transactionId = 'TXN' + Date.now();

    const bookingData = {
      movieId: movie.id,
      movieTitle: movie.title,
      showDate: selectedDate,
      showTime: selectedShowTime,
      seats: selectedSeats,
      totalSeats: selectedSeats.length,
      pricePerSeat: movie.price,
      totalPrice: totalPrice,
      discount: discount,
      finalAmount: finalAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash',
      transactionId: transactionId
    };

    const result = createBooking(bookingData);

    if (result.success) {
      if (appliedCoupon) {
        applyCouponUsage(appliedCoupon.code);
      }
      setMessage({ type: 'success', text: 'Payment successful! Booking confirmed.' });
      setTimeout(() => navigate('/my-bookings'), 2000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  if (!movie) {
    return <div className="container">Loading...</div>;
  }

  const availableDates = generateDates();

  return (
    <div className="movie-details-page">
      <div className="movie-header" style={{ backgroundImage: `url(${movie.poster})` }}>
        <div className="movie-header-overlay">
          <div className="container">
            <div className="movie-header-content">
              <img src={movie.poster} alt={movie.title} className="movie-poster-large" />
              <div className="movie-info-large">
                <h1>{movie.title}</h1>
                <div className="movie-meta-large">
                  <span>⭐ {movie.rating}</span>
                  <span>🕐 {movie.duration}</span>
                  <span>🎭 {movie.genre}</span>
                </div>
                <p className="movie-description">{movie.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="booking-section">
        <div className="container">
          <h2>Book Your Seats</h2>

          {message.text && (
            <div className={`${message.type}-message`}>
              {message.text}
            </div>
          )}

          <div className="show-dates">
            <h3>Select Date</h3>
            <div className="show-dates-grid">
              {availableDates.map(date => {
                const dateValue = formatDateValue(date);
                const isToday = dateValue === formatDateValue(new Date());
                return (
                  <button
                    key={dateValue}
                    className={`show-date-btn ${selectedDate === dateValue ? 'active' : ''}`}
                    onClick={() => setSelectedDate(dateValue)}
                  >
                    <div className="date-day">{formatDate(date).split(',')[0]}</div>
                    <div className="date-full">{formatDate(date).split(',')[1]}</div>
                    {isToday && <div className="today-badge">Today</div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="show-times">
            <h3>Select Show Time</h3>
            <div className="show-times-grid">
              {movie.showTimings.map(time => (
                <button
                  key={time}
                  className={`show-time-btn ${selectedShowTime === time ? 'active' : ''}`}
                  onClick={() => setSelectedShowTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <SeatLayout
            selectedSeats={selectedSeats}
            bookedSeats={bookedSeats}
            onSeatSelect={handleSeatSelect}
          />

          <div className="booking-summary">
            <div className="summary-info">
              <h3>Booking Summary</h3>
              {selectedSeats.length > 0 ? (
                <p className="selected-seats-list">
                  ✓ Selected Seats: {selectedSeats.join(', ')}
                </p>
              ) : (
                <p>Selected Seats: None</p>
              )}
              <p>Show Date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p>Show Time: {selectedShowTime}</p>
              <p>Base Price per Seat: ₹{movie.price}</p>
              <p className="price-note">💡 Rows A-B: 20% off | Rows C-D: Standard | Rows E-F: 20% premium</p>

              {!showPayment && (
                <>
                  <div className="coupon-section">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={appliedCoupon !== null}
                      className="coupon-input"
                    />
                    {!appliedCoupon ? (
                      <button onClick={handleApplyCoupon} className="btn btn-secondary">
                        Apply
                      </button>
                    ) : (
                      <button onClick={handleRemoveCoupon} className="btn btn-danger">
                        Remove
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="coupon-applied">
                      🎟️ {appliedCoupon.discount}% discount applied!
                    </p>
                  )}
                </>
              )}

              {(() => {
                const { totalPrice, discount, finalAmount } = calculateFinalAmount();
                return (
                  <>
                    <p>Subtotal: ₹{totalPrice.toFixed(2)}</p>
                    {discount > 0 && (
                      <p className="discount-amount">Discount: -₹{discount.toFixed(2)}</p>
                    )}
                    <p className="total">Total Amount: ₹{finalAmount.toFixed(2)}</p>
                  </>
                );
              })()}
            </div>

            {!showPayment ? (
              <button
                className="btn btn-primary"
                onClick={handleProceedToPayment}
                disabled={selectedSeats.length === 0}
              >
                {selectedSeats.length > 0
                  ? `Proceed to Payment - ₹${calculateFinalAmount().finalAmount.toFixed(2)}`
                  : 'Select Seats to Continue'
                }
              </button>
            ) : (
              <div className="payment-section">
                <h3>Payment Details</h3>
                <form onSubmit={handlePayment}>
                  <div className="payment-methods">
                    <label className="payment-method">
                      <input
                        type="radio"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>💳 Credit/Debit Card</span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>📱 UPI</span>
                    </label>
                    <label className="payment-method">
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>💵 Cash at Counter</span>
                    </label>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="card-details">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        maxLength="16"
                      />
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      />
                      <div className="card-row">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          maxLength="5"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          maxLength="3"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="upi-details">
                      <input
                        type="text"
                        placeholder="Enter UPI ID (e.g., user@paytm)"
                      />
                    </div>
                  )}

                  {paymentMethod === 'cash' && (
                    <div className="cash-note">
                      <p>💵 Please pay at the counter before the show</p>
                    </div>
                  )}

                  <div className="payment-actions">
                    <button type="submit" className="btn btn-primary">
                      Confirm Payment - ₹{calculateFinalAmount().finalAmount.toFixed(2)}
                    </button>
                    <button type="button" onClick={() => setShowPayment(false)} className="btn btn-secondary">
                      Back
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="container">
            <h2>User Reviews & Ratings</h2>
            
            <div className="rating-summary">
              <div className="average-rating">
                <div className="rating-number">{averageRating || movie.rating}</div>
                <div className="rating-stars-display">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star-display ${(averageRating || movie.rating) >= star ? 'active' : ''}`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="rating-count">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</div>
              </div>
            </div>

            {/* Add Review Form */}
            {currentUser && (
              <div className="add-review-form">
                <h3>Write a Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="rating-input">
                    <label>Your Rating:</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span
                          key={star}
                          className={`star ${newReview.rating >= star ? 'active' : ''}`}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="comment-input">
                    <label>Your Comment:</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your thoughts about this movie..."
                      rows="4"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit Review</button>
                </form>
              </div>
            )}

            {!currentUser && (
              <div className="login-prompt">
                <p>Please <a href="/login">login</a> to write a review</p>
              </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to review this movie!</p>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="user-avatar">{review.userName.charAt(0).toUpperCase()}</div>
                        <div className="user-info">
                          <h4>{review.userName}</h4>
                          <div className="review-rating">
                            {'⭐'.repeat(review.rating)}
                          </div>
                        </div>
                      </div>
                      <div className="review-meta">
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        {currentUser && currentUser.userId === review.userId && (
                          <button 
                            className="btn-delete-review"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
