import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/storage';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = loginUser(formData.email, formData.password);
    
    if (result.success) {
      navigate('/movies');
      window.location.reload();
    } else {
      setError(result.message);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage('Please enter your email address');
      return;
    }
    
    // Simulate password reset (in a real app, this would send an email)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find(u => u.email === resetEmail);
    
    if (userExists) {
      setResetMessage('Password reset link has been sent to your email!');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } else {
      setResetMessage('No account found with this email address');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>User Login</h2>
          {error && <div className="error-message">{error}</div>}
          
          {!showForgotPassword ? (
            <>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="forgot-password-link">
                  <button 
                    type="button" 
                    onClick={() => setShowForgotPassword(true)}
                    className="link-btn"
                  >
                    Forgot Password?
                  </button>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
              </form>
              <p className="auth-link">
                Don't have an account? <Link to="/register">Register here</Link>
              </p>
            </>
          ) : (
            <>
              <div className="forgot-password-form">
                <h3>Reset Password</h3>
                <p className="reset-info">Enter your email address and we'll send you a link to reset your password.</p>
                {resetMessage && (
                  <div className={`message ${resetMessage.includes('sent') ? 'success-message' : 'error-message'}`}>
                    {resetMessage}
                  </div>
                )}
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Send Reset Link</button>
                </form>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetMessage('');
                    setResetEmail('');
                  }}
                  className="back-btn"
                >
                  ← Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
