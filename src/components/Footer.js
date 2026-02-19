import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🎬 CineBook</h3>
          <p>Your ultimate movie booking platform. Book tickets, explore movies, and enjoy cinema like never before.</p>
          <div className="social-links" style={{ marginTop: '15px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">f</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">𝕏</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">📷</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/theaters">Theaters</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Account</h4>
          <ul>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/admin-login">Admin</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📧 support@cinebook.com</p>
          <p>📞 +1 (555) 123-4567</p>
          <p>🕐 24/7 Customer Support</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 CineBook. All rights reserved. | Made with ❤️ for movie lovers</p>
      </div>
    </footer>
  );
};

export default Footer;
