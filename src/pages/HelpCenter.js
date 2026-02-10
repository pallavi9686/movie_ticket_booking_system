import React from 'react';
import './Auth.css';

const HelpCenter = () => {
  return (
    <div className="auth-page">
      <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
        <h1 style={{ color: '#fff', marginBottom: '30px' }}>Help Center</h1>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '30px', borderRadius: '15px', color: '#fff' }}>
          <h2 style={{ color: '#e94560', marginBottom: '20px' }}>How Can We Help You?</h2>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Booking Tickets</h3>
            <p>Browse movies, select your preferred show time, choose your seats, and complete the payment to confirm your booking.</p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Managing Bookings</h3>
            <p>View all your bookings in the "My Bookings" section. You can cancel bookings if needed.</p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Payment Methods</h3>
            <p>We accept Credit/Debit Cards, UPI, and Cash at Counter payments.</p>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Seat Pricing</h3>
            <p>• Rows A-B (Front): 20% discount<br/>• Rows C-D (Middle): Standard price<br/>• Rows E-F (Back): 20% premium</p>
          </div>
          
          <div>
            <h3 style={{ color: '#ffd700', marginBottom: '10px' }}>Need More Help?</h3>
            <p>Contact us at support@cinebook.com or call +1 (555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
