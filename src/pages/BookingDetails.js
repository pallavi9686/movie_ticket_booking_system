import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserBookings, getMovieById, getCurrentUser, cancelBooking, calculateSeatPrice } from '../utils/storage';
import './BookingDetails.css';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [movie, setMovie] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const userBookings = getUserBookings(currentUser.userId);
    const foundBooking = userBookings.find(b => b.id === id);
    
    if (foundBooking) {
      setBooking(foundBooking);
      const movieData = getMovieById(foundBooking.movieId);
      setMovie(movieData);
    } else {
      navigate('/my-bookings');
    }
  }, [id, currentUser, navigate]);

  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(booking.id);
      navigate('/my-bookings');
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  if (!booking || !movie) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="booking-details-page">
      <div className="container">
        <div className="booking-ticket">
          <div className="ticket-header">
            <h1>🎬 Booking Confirmation</h1>
            <p className="booking-id">Booking ID: {booking.id}</p>
          </div>

          <div className="ticket-content">
            <div className="movie-section">
              <img src={movie.poster} alt={movie.title} className="ticket-poster" />
              <div className="movie-details">
                <h2>{booking.movieTitle}</h2>
                <p>⭐ {movie.rating} | 🕐 {movie.duration}</p>
                <p>🎭 {movie.genre}</p>
              </div>
            </div>

            <div className="booking-details-section">
              <div className="detail-row">
                <span className="label">Show Time:</span>
                <span className="value">{booking.showTime}</span>
              </div>
              <div className="detail-row">
                <span className="label">Booking Date:</span>
                <span className="value">{new Date(booking.bookingDate).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Customer Name:</span>
                <span className="value">{booking.userName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{booking.userEmail}</span>
              </div>
            </div>

            <div className="seats-breakdown">
              <h3>Seat-wise Pricing</h3>
              <table className="seats-table">
                <thead>
                  <tr>
                    <th>Seat</th>
                    <th>Row Type</th>
                    <th>Base Price</th>
                    <th>Multiplier</th>
                    <th>Final Price</th>
                  </tr>
                </thead>
                <tbody>
                  {booking.seats.map(seat => {
                    const row = seat.charAt(0);
                    const rowType = ['A', 'B'].includes(row) ? 'Front (20% off)' : 
                                   ['C', 'D'].includes(row) ? 'Middle (Standard)' : 
                                   'Back (20% premium)';
                    const multiplier = ['A', 'B'].includes(row) ? '0.8x' : 
                                      ['C', 'D'].includes(row) ? '1.0x' : '1.2x';
                    const basePrice = booking.pricePerSeat || movie.price || 15;
                    const seatPrice = calculateSeatPrice(seat, basePrice);
                    
                    return (
                      <tr key={seat}>
                        <td className="seat-number">{seat}</td>
                        <td>{rowType}</td>
                        <td>₹{Number(basePrice).toFixed(2)}</td>
                        <td>{multiplier}</td>
                        <td className="seat-price">₹{seatPrice.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({booking.totalSeats} seats):</span>
                <span>${booking.totalPrice.toFixed(2)}</span>
              </div>
              {booking.couponCode && (
                <>
                  <div className="summary-row coupon-applied">
                    <span>Coupon ({booking.couponCode}):</span>
                    <span>-${booking.discount.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Amount After Discount:</span>
                    <span>${booking.finalAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="summary-row total-row">
                <span>Total Paid:</span>
                <span>${(booking.finalAmount || booking.totalPrice).toFixed(2)}</span>
              </div>
              {booking.paymentMethod && (
                <div className="summary-row">
                  <span>Payment Method:</span>
                  <span>{booking.paymentMethod}</span>
                </div>
              )}
              {booking.transactionId && (
                <div className="summary-row">
                  <span>Transaction ID:</span>
                  <span>{booking.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="ticket-actions">
            <button onClick={handlePrintTicket} className="btn btn-primary">
              🖨️ Print Ticket
            </button>
            <button onClick={() => navigate('/my-bookings')} className="btn btn-secondary">
              ← Back to Bookings
            </button>
            <button onClick={handleCancelBooking} className="btn btn-danger">
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
