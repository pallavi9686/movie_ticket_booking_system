import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🎬 CineBook</h3>
            <p>Your trusted movie booking partner since 2024</p>
            <div className="social-links">
              <a href="#facebook">f</a>
              <a href="#twitter">𝕏</a>
              <a href="#instagram">📷</a>
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
              <li><a href="/help-center" onClick={(e) => { e.preventDefault(); alert('Help Center - Coming Soon!\n\nFor immediate assistance, please contact our support team at support@cinebook.com'); }}>Help Center</a></li>
              <li><a href="/faq" onClick={(e) => { e.preventDefault(); alert('Frequently Asked Questions\n\n1. How do I book tickets?\n   - Select a movie, choose date & time, pick seats, and proceed to payment.\n\n2. Can I cancel my booking?\n   - Yes, go to My Bookings and click Cancel.\n\n3. What payment methods are accepted?\n   - Credit/Debit Cards, UPI, and Cash at Counter.\n\n4. How do I apply a coupon?\n   - Enter the coupon code during checkout.\n\nFor more questions, contact: support@cinebook.com'); }}>FAQ</a></li>
              <li><a href="/contact" onClick={(e) => { e.preventDefault(); alert('Contact Us\n\n📧 Email: support@cinebook.com\n📞 Phone: +1 (555) 123-4567\n🕐 Available: 24/7\n\nWe\'re here to help!'); }}>Contact Us</a></li>
              <li><a href="/privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy\n\nYour privacy is important to us. We collect and use your personal information only for booking purposes.\n\n• We do not share your data with third parties\n• All payments are processed securely\n• You can request data deletion anytime\n\nFor full privacy policy, contact: support@cinebook.com'); }}>Privacy Policy</a></li>
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
      </div>
    </footer>
  );
};

export default Footer;
