import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserBookings, getMovieById, cancelBooking, getMovieReviews, addReview } from '../utils/api';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState({});
  const [reviewData, setReviewData] = useState({});
  const [message, setMessage] = useState({ type: '', text: '', bookingId: null });
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
              
              // Check if user has reviewed this movie
              const reviewsData = await getMovieReviews(booking.movie_id);
              const hasReviewed = reviewsData.reviews ? reviewsData.reviews.some(r => r.user_id === currentUser.id) : false;
              
              // Check if show date has passed
              const showDate = new Date(booking.show_date);
              const today = new Date();
              const isPastShow = showDate < today;
              
              return { ...booking, movie, hasReviewed, isPastShow };
            } catch (error) {
              return { ...booking, movie: null, hasReviewed: false, isPastShow: false };
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

  const handleDownloadTicket = (booking) => {
    const ticketContent = `
╔════════════════════════════════════════════════════════════╗
║                    🎬 CINE BOOK TICKET 🎬                  ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Movie: ${booking.movie?.title || 'N/A'}                  
║  Booking ID: ${booking.id}                                
║                                                            ║
║  Date: ${booking.show_date ? new Date(booking.show_date).toLocaleDateString() : 'N/A'}
║  Time: ${booking.show_time}                               
║                                                            ║
║  Seats: ${booking.seats.join(', ')}                       
║  Total Paid: ₹${booking.total_price ? parseFloat(booking.total_price).toFixed(2) : '0.00'}
║                                                            ║
║  Booked By: ${currentUser.name}                           
║  Booking Date: ${new Date(booking.booking_date).toLocaleDateString()}
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║  Please arrive 15 minutes before showtime                 ║
║  Present this ticket at the entrance                      ║
╚════════════════════════════════════════════════════════════╝
    `.trim();

    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineBook-Ticket-${booking.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleReviewForm = (bookingId) => {
    setShowReviewForm(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
    // Initialize review data if not exists
    if (!reviewData[bookingId]) {
      setReviewData(prev => ({
        ...prev,
        [bookingId]: { rating: 0, comment: '' }
      }));
    }
  };

  const handleRatingChange = (bookingId, rating) => {
    setReviewData(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], rating }
    }));
  };

  const handleCommentChange = (bookingId, comment) => {
    setReviewData(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], comment }
    }));
  };

  const handleSubmitReview = async (booking) => {
    const review = reviewData[booking.id];
    
    if (!review || review.rating === 0) {
      setMessage({ 
        type: 'error', 
        text: 'Please select a rating', 
        bookingId: booking.id 
      });
      setTimeout(() => setMessage({ type: '', text: '', bookingId: null }), 3000);
      return;
    }

    try {
      await addReview({
        movie_id: booking.movie_id,
        rating: review.rating,
        comment: review.comment
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Review submitted successfully!', 
        bookingId: booking.id 
      });
      
      // Update booking to mark as reviewed
      setBookings(bookings.map(b => 
        b.id === booking.id ? { ...b, hasReviewed: true } : b
      ));
      
      // Hide form
      setShowReviewForm(prev => ({ ...prev, [booking.id]: false }));
      
      setTimeout(() => setMessage({ type: '', text: '', bookingId: null }), 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message, 
        bookingId: booking.id 
      });
      setTimeout(() => setMessage({ type: '', text: '', bookingId: null }), 3000);
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
                {booking.isPastShow && !booking.hasReviewed && (
                  <div className="review-badge">
                    ⭐ Rate this movie
                  </div>
                )}
                {booking.movie && (
                  <img src={booking.movie.poster} alt={booking.movie.title} className="booking-poster" />
                )}
                <div className="booking-info">
                  <h3>{booking.movie?.title || 'Movie'}</h3>
                  <p><strong>Show Date:</strong> {booking.show_date ? new Date(booking.show_date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Show Time:</strong> {booking.show_time}</p>
                  {booking.theaterName && (
                    <p><strong>Theater:</strong> 🎭 {booking.theaterName} - {booking.theaterLocation}</p>
                  )}
                  <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
                  {booking.total_price && (
                    <p className="booking-price"><strong>Total Paid:</strong> ₹{parseFloat(booking.total_price).toFixed(2)}</p>
                  )}
                  <p><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
                  
                  {message.bookingId === booking.id && message.text && (
                    <div className={`review-message ${message.type}`}>
                      {message.text}
                    </div>
                  )}

                  {showReviewForm[booking.id] && (
                    <div className="inline-review-form">
                      <h4>Rate & Review</h4>
                      <div className="rating-input">
                        <label>Your Rating:</label>
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              className={`star ${reviewData[booking.id]?.rating >= star ? 'filled' : ''}`}
                              onClick={() => handleRatingChange(booking.id, star)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <textarea
                        placeholder="Share your thoughts about this movie..."
                        value={reviewData[booking.id]?.comment || ''}
                        onChange={(e) => handleCommentChange(booking.id, e.target.value)}
                        rows="3"
                      />
                      <div className="review-form-actions">
                        <button 
                          onClick={() => handleSubmitReview(booking)}
                          className="btn btn-primary btn-sm"
                        >
                          Submit Review
                        </button>
                        <button 
                          onClick={() => toggleReviewForm(booking.id)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="booking-actions">
                    <Link to={`/booking/${booking.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                    <button
                      onClick={() => handleDownloadTicket(booking)}
                      className="btn btn-success"
                    >
                      Download Ticket
                    </button>
                    {booking.isPastShow && !booking.hasReviewed && (
                      <button 
                        onClick={() => toggleReviewForm(booking.id)}
                        className="btn btn-warning"
                      >
                        {showReviewForm[booking.id] ? 'Hide Review Form' : 'Write Review'}
                      </button>
                    )}
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
