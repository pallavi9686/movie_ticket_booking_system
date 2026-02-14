import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserBookings, getMovieById, cancelBooking } from '../utils/api';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const userBookings = await getUserBookings(currentUser.userId);
        const bookingsWithMovies = await Promise.all(
          userBookings.map(async (booking) => {
            try {
              const movie = await getMovieById(booking.movie_id);
              return { ...booking, movie };
            } catch (error) {
              return { ...booking, movie: null };
            }
          })
        );
        setBookings(bookingsWithMovies);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
        setBookings(bookings.filter(b => b.id !== bookingId));
      } catch (error) {
        alert('Failed to cancel booking: ' + error.message);
      }
    }
  };

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return <div className="container">Loading...</div>;
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
                  <img src={booking.movie.poster} alt={booking.movie.title} className="booking-poster" />
                )}
                <div className="booking-info">
                  <h3>{booking.movie?.title || 'Movie'}</h3>
                  <p><strong>Show Date:</strong> {booking.show_date ? new Date(booking.show_date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Show Time:</strong> {booking.show_time}</p>
                  <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                  {booking.total_price && (
                    <p className="booking-price"><strong>Total Paid:</strong> ₹{parseFloat(booking.total_price).toFixed(2)}</p>
                  )}
                  <p><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
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
