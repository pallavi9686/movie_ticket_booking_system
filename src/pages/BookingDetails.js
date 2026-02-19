import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, getUserBookings, cancelBooking, getMovieReviews, addReview } from '../utils/api';
import './BookingDetails.css';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
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
          
          // Check if user has already reviewed this movie
          const reviewsData = await getMovieReviews(foundBooking.movie_id);
          const userReview = reviewsData.reviews ? reviewsData.reviews.find(r => r.user_id === currentUser.id) : null;
          setHasReviewed(!!userReview);
          
          // Show review prompt if booking is completed and user hasn't reviewed
          const showDate = new Date(foundBooking.show_date);
          const today = new Date();
          if (showDate <= today && !userReview) {
            setShowReviewPrompt(true);
          }
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (userRating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' });
      return;
    }

    try {
      await addReview({
        movie_id: movie.id,
        rating: userRating,
        comment: userComment
      });
      setMessage({ type: 'success', text: 'Thank you for your review!' });
      setShowReviewPrompt(false);
      setHasReviewed(true);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
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
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {showReviewPrompt && !hasReviewed && (
          <div className="review-prompt">
            <div className="review-prompt-header">
              <h3>🌟 How was your experience?</h3>
              <p>Share your thoughts about {movie.title}</p>
            </div>
            <form onSubmit={handleSubmitReview} className="review-prompt-form">
              <div className="rating-input">
                <label>Your Rating:</label>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span
                      key={star}
                      className={`star ${userRating >= star ? 'filled' : ''}`}
                      onClick={() => setUserRating(star)}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <textarea
                placeholder="Tell us what you thought about the movie..."
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                rows="3"
              />
              <div className="review-prompt-actions">
                <button type="submit" className="btn btn-primary">Submit Review</button>
                <button 
                  type="button" 
                  onClick={() => setShowReviewPrompt(false)} 
                  className="btn btn-secondary"
                >
                  Maybe Later
                </button>
              </div>
            </form>
          </div>
        )}

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
                <span className="label">Seats:</span>
                <span className="value">{booking.seats.join(', ')}</span>
              </div>
              <div className="detail-row">
                <span className="label">Booking Date:</span>
                <span className="value">{new Date(booking.booking_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-row">
                <span className="label">Theater:</span>
                <span className="value">
                  {booking.theaterName ? (
                    <>
                      🎭 {booking.theaterName}
                      <br />
                      <small style={{ color: '#a8a8a8' }}>📍 {booking.theaterLocation}</small>
                    </>
                  ) : (
                    'Theater information not available'
                  )}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Total Paid:</span>
                <span className="value">₹{parseFloat(booking.total_price).toFixed(2)}</span>
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
