import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getCurrentAdmin, logout, getCoupons } from '../utils/storage';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [showOffers, setShowOffers] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getCurrentUser());
    setAdmin(getCurrentAdmin());
    loadCoupons();
  }, []);

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
        <div className="navbar-left">
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
        </div>
        
        <div className="navbar-right">
          <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            
            {user && (
              <li><Link to="/my-bookings">My Bookings</Link></li>
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
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/admin-login">Admin</Link></li>
              </>
            )}
            
            {(user || admin) && (
              <li className="profile-dropdown">
                <button 
                  className="profile-btn"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="profile-avatar">
                    {user ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <span className="profile-name">
                    {user ? user.name : 'Admin'}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                {showProfile && (
                  <div className="profile-menu">
                    <div className="profile-header">
                      <div className="profile-avatar-large">
                        {user ? user.name.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div className="profile-info">
                        <h4>{user ? user.name : 'Administrator'}</h4>
                        <p>{user ? user.email : 'admin@cineBook.com'}</p>
                        <span className="profile-role">
                          {user ? 'Customer' : 'Administrator'}
                        </span>
                      </div>
                      <button className="close-btn" onClick={() => setShowProfile(false)}>✕</button>
                    </div>
                    <div className="profile-actions">
                      {user && (
                        <>
                          <Link to="/my-bookings" className="profile-action" onClick={() => setShowProfile(false)}>
                            🎫 My Bookings
                          </Link>
                          <Link to="/profile" className="profile-action" onClick={() => setShowProfile(false)}>
                            👤 Edit Profile
                          </Link>
                          <Link to="/settings" className="profile-action" onClick={() => setShowProfile(false)}>
                            ⚙️ Settings
                          </Link>
                        </>
                      )}
                      {admin && (
                        <>
                          <Link to="/admin" className="profile-action" onClick={() => setShowProfile(false)}>
                            📊 Dashboard
                          </Link>
                          <Link to="/admin/settings" className="profile-action" onClick={() => setShowProfile(false)}>
                            ⚙️ Admin Settings
                          </Link>
                        </>
                      )}
                      <button onClick={handleLogout} className="profile-action logout-action">
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
