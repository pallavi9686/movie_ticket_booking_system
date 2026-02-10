import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatLayout from '../components/SeatLayout';
import { getMovieById, getBookedSeats, calculateTotalPrice, validateCoupon, createBooking } from '../utils/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [selectedShowDate, setSelectedShowDate] = useState('');
  const [selectedShowTime, setSelectedShowTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await getMovieById(id);
        console.log('Fetched movie:', movieData);
        console.log('Show timings:', movieData.showTimings);
        setMovie(movieData);
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setSelectedShowDate(today);
        if (movieData.showTimings && movieData.showTimings.length > 0) {
          console.log('Setting show time to:', movieData.showTimings[0]);
          setSelectedShowTime(movieData.showTimings[0]);
        }
      } catch (error) {
        console.error('Failed to fetch movie:', error);
      }
    };
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie && selectedShowDate && selectedShowTime) {
      const fetchBookedSeats = async () => {
        try {
          const data = await getBookedSeats(movie.id, selectedShowTime, selectedShowDate);
          setBookedSeats(data.bookedSeats || []);
          setSelectedSeats([]);
        } catch (error) {
          console.error('Failed to fetch booked seats:', error);
        }
      };
      fetchBookedSeats();
    }
  }, [movie, selectedShowDate, selectedShowTime]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a coupon code' });
      return;
    }

    try {
      console.log('Validating coupon:', couponCode);
      const result = await validateCoupon(couponCode);
      console.log('Coupon validation result:', result);
      setAppliedCoupon(result.coupon);
      setMessage({ type: 'success', text: `✅ Coupon applied! ${result.coupon.discount_percentage}% off` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Coupon validation error:', error);
      const errorMsg = error.message || 'Invalid coupon code';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
      // Keep error message longer so user can see it
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setMessage({ type: 'success', text: 'Coupon removed' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const calculateFinalAmount = () => {
    if (!movie || selectedSeats.length === 0) return { totalPrice: 0, discount: 0, finalAmount: 0 };
    
    const totalPrice = selectedSeats.reduce((sum, seat) => {
      const row = seat.charAt(0);
      const multiplier = ['A', 'B'].includes(row) ? 0.8 : ['C', 'D'].includes(row) ? 1.0 : 1.2;
      return sum + (movie.price * multiplier);
    }, 0);
    
    if (appliedCoupon) {
      const discount = (totalPrice * appliedCoupon.discount_percentage) / 100;
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

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setMessage({ type: 'error', text: '❌ Please login to book tickets' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage({ type: 'error', text: '❌ Session expired. Please login again' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    
    if (paymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        setMessage({ type: 'error', text: '❌ Please fill all card details' });
        return;
      }
    }

    const { totalPrice, discount, finalAmount } = calculateFinalAmount();

    if (!selectedShowDate || selectedShowDate.trim() === '') {
      setMessage({ type: 'error', text: '❌ Please select a show date' });
      return;
    }

    if (!selectedShowTime || selectedShowTime.trim() === '') {
      setMessage({ type: 'error', text: '❌ Please select a show time' });
      return;
    }

    if (selectedSeats.length === 0) {
      setMessage({ type: 'error', text: '❌ Please select at least one seat' });
      return;
    }

    if (!finalAmount || finalAmount <= 0) {
      setMessage({ type: 'error', text: '❌ Invalid booking amount' });
      return;
    }

    const bookingData = {
      movieId: movie.id,
      showDate: selectedShowDate,
      showTime: selectedShowTime,
      seats: selectedSeats,
      totalPrice: finalAmount
    };

    try {
      console.log('Movie ID:', movie.id);
      console.log('Show Time:', selectedShowTime);
      console.log('Seats:', selectedSeats);
      console.log('Total Price:', finalAmount);
      console.log('Creating booking with data:', bookingData);
      console.log('Token available:', !!token);
      await createBooking(bookingData);
      setMessage({ type: 'success', text: '✅ Payment successful! Booking confirmed.' });
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (error) {
      console.error('Booking error:', error);
      setMessage({ type: 'error', text: `❌ ${error.message}` });
    }
  };

  if (!movie) {
    return <div className="container">Loading...</div>;
  }

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

          <div className="show-date-section">
            <h3>Select Show Date</h3>
            <input
              type="date"
              value={selectedShowDate}
              onChange={(e) => setSelectedShowDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className="date-input"
            />
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
              <p>Show Date: {selectedShowDate ? new Date(selectedShowDate).toLocaleDateString() : 'Not selected'}</p>
              <p>Show Time: {selectedShowTime}</p>
              <p>Base Price per Seat: ${movie.price}</p>
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
                  {message.type === 'error' && (
                    <p className="coupon-error">
                      {message.text}
                    </p>
                  )}
                  {appliedCoupon && (
                    <p className="coupon-applied">
                      🎟️ {appliedCoupon.discount_percentage}% discount applied!
                    </p>
                  )}
                </>
              )}
              
              {(() => {
                const { totalPrice, discount, finalAmount } = calculateFinalAmount();
                return (
                  <>
                    <p>Subtotal: ${totalPrice.toFixed(2)}</p>
                    {discount > 0 && (
                      <p className="discount-amount">Discount: -${discount.toFixed(2)}</p>
                    )}
                    <p className="total">Total Amount: ${finalAmount.toFixed(2)}</p>
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
                  ? `Proceed to Payment - $${calculateFinalAmount().finalAmount.toFixed(2)}`
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
                      Confirm Payment - ${calculateFinalAmount().finalAmount.toFixed(2)}
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
      </div>
    </div>
  );
};

export default MovieDetails;
