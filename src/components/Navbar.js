import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, getCurrentAdmin, logout, getCoupons } from '../utils/storage';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [showOffers, setShowOffers] = useState(false);
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
