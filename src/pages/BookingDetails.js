import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getUserBookings, cancelBooking } from '../utils/api';
import './BookingDetails.css';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        const userBookings = await getUserBookings(currentUser.userId);
        const foundBooking = userBookings.find(b => b.id === parseInt(id));
        
        if (foundBooking) {
          setBooking(foundBooking);
          const movieData = await getMovieById(foundBooking.movie_id);
          setMovie(movieData);
        } else {
          navigate('/my-bookings');
        }
      } catch (error) {
        console.error('Failed to fetch booking:', error);
        navigate('/my-bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, currentUser, navigate]);

  const handleCancelBooking = async () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(booking.id);
        navigate('/my-bookings');
      } catch (error) {
        alert('Failed to cancel booking: ' + error.message);
      }
    }
  };

  const handlePrintTicket = () => {
    window.print();
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!booking || !movie) {
    return <div className="container">Booking not found</div>;
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
                <h2>{movie.title}</h2>
                <p>⭐ {movie.rating} | 🕐 {movie.duration}</p>
                <p>🎭 {movie.genre}</p>
              </div>
            </div>

            <div className="booking-details-section">
              <div className="detail-row">
                <span className="label">Show Date:</span>
                <span className="value">{booking.show_date ? new Date(booking.show_date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Show Time:</span>
                <span className="value">{booking.show_time}</span>
              </div>
              <div className="detail-row">
                <span className="label">Booking Date:</span>
                <span className="value">{new Date(booking.booking_date).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Customer Name:</span>
                <span className="value">{currentUser.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{currentUser.email}</span>
              </div>
            </div>

            <div className="seats-breakdown">
              <h3>Selected Seats</h3>
              <p className="seats-list">{booking.seats.join(', ')}</p>
            </div>

            <div className="payment-summary">
              <h3>Payment Summary</h3>
              <div className="summary-row">
                <span>Total Amount:</span>
                <span>${parseFloat(booking.total_price).toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Amount Paid:</span>
                <span>${parseFloat(booking.total_price).toFixed(2)}</span>
              </div>
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
