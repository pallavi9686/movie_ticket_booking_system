import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, getUserBookings, getMovieById, cancelBooking } from '../utils/storage';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const userBookings = getUserBookings(currentUser.userId);
    const bookingsWithMovies = userBookings.map(booking => ({
      ...booking,
      movie: getMovieById(booking.movieId)
    }));
    setBookings(bookingsWithMovies);
  }, [currentUser, navigate]);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
      const userBookings = getUserBookings(currentUser.userId);
      const bookingsWithMovies = userBookings.map(booking => ({
        ...booking,
        movie: getMovieById(booking.movieId)
      }));
      setBookings(bookingsWithMovies);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="my-bookings-page">
      <div className="container">
        <h1 className="page-title">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You haven't made any bookings yet.</p>
            <button onClick={() => navigate('/movies')} className="btn btn-primary">
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                {booking.movie && (
                  <img src={booking.movie.poster} alt={booking.movieTitle} className="booking-poster" />
                )}
                <div className="booking-info">
                  <h3>{booking.movieTitle}</h3>
                  <p><strong>Show Time:</strong> {booking.showTime}</p>
                  <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                  <p><strong>Total Seats:</strong> {booking.totalSeats}</p>
                  {booking.totalPrice && (
                    <p className="booking-price"><strong>Total Paid:</strong> ${(booking.finalAmount || booking.totalPrice).toFixed(2)}</p>
                  )}
                  {booking.couponCode && (
                    <p className="coupon-badge">🎟️ Coupon: {booking.couponCode}</p>
                  )}
                  <p><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  <div className="booking-actions">
                    <Link to={`/booking/${booking.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn btn-danger"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
