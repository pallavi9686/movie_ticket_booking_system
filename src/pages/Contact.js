import React, { useState } from 'react';
import './Auth.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
        <h1 style={{ color: '#fff', marginBottom: '30px' }}>Contact Us</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '30px', borderRadius: '15px', color: '#fff' }}>
            <h3 style={{ color: '#e94560', marginBottom: '20px' }}>Get In Touch</h3>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#ffd700', marginBottom: '5px' }}>📧 Email</p>
              <p>support@cinebook.com</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#ffd700', marginBottom: '5px' }}>📞 Phone</p>
              <p>+1 (555) 123-4567</p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#ffd700', marginBottom: '5px' }}>📍 Address</p>
              <p>123 Cinema Street<br/>Movie City, MC 12345</p>
            </div>
            <div>
              <p style={{ color: '#ffd700', marginBottom: '5px' }}>🕐 Business Hours</p>
              <p>Mon - Fri: 9:00 AM - 6:00 PM<br/>Sat - Sun: 10:00 AM - 4:00 PM</p>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '30px', borderRadius: '15px' }}>
            <h3 style={{ color: '#e94560', marginBottom: '20px' }}>Send Us a Message</h3>
            {submitted && (
              <div style={{ 
                background: 'rgba(76, 175, 80, 0.2)', 
                color: '#4caf50', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                ✅ Message sent successfully!
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your Message"
                  rows="5"
                  required
                  style={{ resize: 'vertical' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
