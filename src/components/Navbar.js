import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
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
          <li><Link to="/releases">Releases</Link></li>
          <li><Link to="/theaters">Theaters</Link></li>
          <li><Link to="/offers">Offers</Link></li>

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
