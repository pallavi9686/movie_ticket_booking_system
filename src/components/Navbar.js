import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getCurrentAdmin, logout, getCoupons, getUserBookings } from '../utils/storage';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [showOffers, setShowOffers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTickets, setShowTickets] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getCurrentUser());
    setAdmin(getCurrentAdmin());
    loadCoupons();
    loadUserBookings();
  }, []);

  const loadUserBookings = () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const bookings = getUserBookings(currentUser.userId);
      setUserBookings(bookings);
    }
  };

  const loadCoupons = () => {
    const allCoupons = getCoupons();
    const activeCoupons = allCoupons.filter(c => {
      const isExpired = new Date(c.expiryDate) < new Date();
      const isMaxed = c.usageCount >= c.maxUsage;
      return c.active && !isExpired && !isMaxed;
    });
    setCoupons(activeCoupons);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setAdmin(null);
    navigate('/');
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎬 CineBook
        </Link>
        
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
        
        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/releases">Releases</Link></li>
          
          {user && (
            <>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li className="tickets-dropdown">
                <button 
                  className="tickets-btn"
                  onClick={() => setShowTickets(!showTickets)}
                >
                  🎫 Tickets {userBookings.length > 0 && <span className="badge">{userBookings.length}</span>}
                </button>
                {showTickets && userBookings.length > 0 && (
                  <div className="tickets-menu">
                    <div className="tickets-header">
                      <h4>Your Tickets</h4>
                      <button className="close-btn" onClick={() => setShowTickets(false)}>✕</button>
                    </div>
                    <div className="tickets-list">
                      {userBookings.map(booking => (
                        <div key={booking.id} className="ticket-item">
                          <div className="ticket-info">
                            <h5>{booking.movieTitle}</h5>
                            <p>🎬 {booking.seats.join(', ')}</p>
                            <p>📅 {booking.showDate ? new Date(booking.showDate).toLocaleDateString() : 'N/A'}</p>
                            <p>🕐 {booking.showTime}</p>
                            <p className="ticket-price">₹{(booking.finalAmount || booking.totalPrice).toFixed(2)}</p>
                          </div>
                          <div className="ticket-qr">
                            <div className="qr-code">
                              <svg viewBox="0 0 100 100" width="80" height="80">
                                <rect width="100" height="100" fill="white"/>
                                <rect x="10" y="10" width="15" height="15" fill="black"/>
                                <rect x="30" y="10" width="5" height="5" fill="black"/>
                                <rect x="40" y="10" width="10" height="10" fill="black"/>
                                <rect x="55" y="10" width="5" height="5" fill="black"/>
                                <rect x="65" y="10" width="5" height="5" fill="black"/>
                                <rect x="75" y="10" width="15" height="15" fill="black"/>
                                <rect x="10" y="30" width="5" height="5" fill="black"/>
                                <rect x="20" y="30" width="5" height="5" fill="black"/>
                                <rect x="30" y="30" width="10" height="10" fill="black"/>
                                <rect x="45" y="30" width="5" height="5" fill="black"/>
                                <rect x="55" y="30" width="10" height="10" fill="black"/>
                                <rect x="70" y="30" width="5" height="5" fill="black"/>
                                <rect x="80" y="30" width="5" height="5" fill="black"/>
                                <rect x="10" y="45" width="10" height="10" fill="black"/>
                                <rect x="25" y="45" width="5" height="5" fill="black"/>
                                <rect x="35" y="45" width="5" height="5" fill="black"/>
                                <rect x="45" y="45" width="10" height="10" fill="black"/>
                                <rect x="60" y="45" width="5" height="5" fill="black"/>
                                <rect x="70" y="45" width="10" height="10" fill="black"/>
                                <rect x="85" y="45" width="5" height="5" fill="black"/>
                                <rect x="10" y="60" width="5" height="5" fill="black"/>
                                <rect x="20" y="60" width="10" height="10" fill="black"/>
                                <rect x="35" y="60" width="5" height="5" fill="black"/>
                                <rect x="45" y="60" width="5" height="5" fill="black"/>
                                <rect x="55" y="60" width="10" height="10" fill="black"/>
                                <rect x="70" y="60" width="5" height="5" fill="black"/>
                                <rect x="80" y="60" width="10" height="10" fill="black"/>
                                <rect x="10" y="75" width="15" height="15" fill="black"/>
                                <rect x="30" y="75" width="5" height="5" fill="black"/>
                                <rect x="40" y="75" width="10" height="10" fill="black"/>
                                <rect x="55" y="75" width="5" height="5" fill="black"/>
                                <rect x="65" y="75" width="5" height="5" fill="black"/>
                                <rect x="75" y="75" width="15" height="15" fill="black"/>
                              </svg>
                            </div>
                            <p className="qr-label">Booking ID: {booking.id.slice(0, 8)}</p>
                          </div>
                          <button 
                            className="download-btn"
                            onClick={() => {
                              alert(`Ticket for ${booking.movieTitle} downloaded!\n\nBooking ID: ${booking.id}\nSeats: ${booking.seats.join(', ')}\nShow: ${booking.showTime}\n\nPlease show this QR code at the theatre entrance.`);
                            }}
                          >
                            📥 Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            </>
          )}
          
          {admin && (
            <li><Link to="/admin">Dashboard</Link></li>
          )}
          
          <li className="offers-dropdown">
            <button 
              className="offers-btn"
              onClick={() => setShowOffers(!showOffers)}
            >
              🎟️ Offers {coupons.length > 0 && <span className="badge">{coupons.length}</span>}
            </button>
            {showOffers && coupons.length > 0 && (
              <div className="offers-menu">
                <div className="offers-header">
                  <h4>Active Coupons</h4>
                  <button className="close-btn" onClick={() => setShowOffers(false)}>✕</button>
                </div>
                <div className="offers-list">
                  {coupons.map(coupon => (
                    <div key={coupon.id} className="offer-item">
                      <div className="offer-code">{coupon.code}</div>
                      <div className="offer-details">
                        <p className="offer-discount">{coupon.discount}% OFF</p>
                        <p className="offer-desc">{coupon.description}</p>
                        {coupon.city && <p className="offer-city">📍 {coupon.city}</p>}
                        <p className="offer-expiry">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</p>
                      </div>
                      <button 
                        className="copy-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(coupon.code);
                          alert('Coupon copied!');
                        }}
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
          
          {!user && !admin && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/admin-login">Admin</Link></li>
            </>
          )}
          
          {(user || admin) && (
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Logout {user ? `(${user.name})` : '(Admin)'}
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
