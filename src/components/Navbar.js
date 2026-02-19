import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCoupons } from '../utils/api';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOffers, setShowOffers] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const currentAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
    setUser(currentUser);
    setAdmin(currentAdmin);

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
      const updatedAdmin = JSON.parse(localStorage.getItem('currentAdmin'));
      setUser(updatedUser);
      setAdmin(updatedAdmin);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (showOffers) {
      fetchCoupons();
    }
  }, [showOffers]);

  const fetchCoupons = async () => {
    try {
      const data = await getCoupons();
      setCoupons(data.slice(0, 3)); // Show only first 3 coupons
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAdmin');
    setUser(null);
    setAdmin(null);
    navigate('/');
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎬 CineBook
        </Link>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>

        <ul className="navbar-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/movies">Movies</Link></li>
          <li><Link to="/theaters">Theaters</Link></li>
          
          <li className="offers-dropdown">
            <button 
              className="offers-btn" 
              onClick={() => setShowOffers(!showOffers)}
            >
              🎁 Offers
              {coupons.length > 0 && <span className="badge">{coupons.length}</span>}
            </button>
            
            {showOffers && (
              <div className="offers-menu">
                <div className="offers-header">
                  <h4>🎉 Active Offers</h4>
                  <button className="close-btn" onClick={() => setShowOffers(false)}>✕</button>
                </div>
                
                {coupons.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', margin: '20px 0' }}>
                    No active offers
                  </p>
                ) : (
                  <div className="offers-list">
                    {coupons.map((coupon) => (
                      <div key={coupon.id} className="offer-item">
                        <div>
                          <div className="offer-code">{coupon.code}</div>
                        </div>
                        <div className="offer-details">
                          <p className="offer-discount">
                            {coupon.discount_percentage 
                              ? `${coupon.discount_percentage}% OFF`
                              : `₹${coupon.discount_amount} OFF`
                            }
                          </p>
                          <p className="offer-expiry">Valid till {formatDate(coupon.expiry_date)}</p>
                        </div>
                        <button 
                          className="copy-btn"
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          {copiedCode === coupon.code ? '✓' : '📋'}
                        </button>
                      </div>
                    ))}
                    <Link 
                      to="/offers" 
                      style={{ 
                        color: '#ffd93d', 
                        textAlign: 'center', 
                        textDecoration: 'none',
                        marginTop: '10px',
                        display: 'block',
                        fontSize: '14px'
                      }}
                      onClick={() => setShowOffers(false)}
                    >
                      View All Offers →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </li>

          {user && (
            <li><Link to="/my-bookings">My Bookings</Link></li>
          )}

          {admin && (
            <li><Link to="/admin">Dashboard</Link></li>
          )}

          {!user && !admin && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
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
