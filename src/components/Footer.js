import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>🎬 CineBook</h3>
          <p>Your trusted movie booking partner since 2024</p>
          <div className="social-links" style={{ marginTop: '15px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">f</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">𝕏</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">📷</a>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/movies">Browse Movies</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/admin-login">Admin</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/help-center">Help Center</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
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
