import React from 'react';
import './Auth.css';

const PrivacyPolicy = () => {
  return (
    <div className="auth-page">
      <div className="container" style={{ maxWidth: '900px', padding: '40px 20px' }}>
        <h1 style={{ color: '#fff', marginBottom: '30px' }}>Privacy Policy</h1>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '40px', borderRadius: '15px', color: '#fff', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '20px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Last Updated: February 10, 2026
          </p>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>1. Information We Collect</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              We collect information you provide directly to us, including your name, email address, phone number, 
              and payment information when you register for an account or make a booking.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>2. How We Use Your Information</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              We use the information we collect to:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '10px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <li>Process your bookings and payments</li>
              <li>Send you booking confirmations and updates</li>
              <li>Improve our services and user experience</li>
              <li>Communicate with you about promotions and offers</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>3. Information Sharing</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              We do not sell, trade, or rent your personal information to third parties. We may share your 
              information with trusted service providers who assist us in operating our platform, conducting 
              our business, or servicing you.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>4. Data Security</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              We implement appropriate security measures to protect your personal information. However, no 
              method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>5. Cookies</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              We use cookies and similar tracking technologies to enhance your experience on our platform. 
              You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>6. Your Rights</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              You have the right to:
            </p>
            <ul style={{ marginLeft: '20px', marginTop: '10px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>7. Children's Privacy</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Our services are not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>8. Changes to This Policy</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 style={{ color: '#e94560', marginBottom: '15px' }}>9. Contact Us</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              If you have any questions about this Privacy Policy, please contact us at:
              <br/><br/>
              Email: privacy@cinebook.com<br/>
              Phone: +1 (555) 123-4567<br/>
              Address: 123 Cinema Street, Movie City, MC 12345
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
