import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: 'white',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '40px',
            borderRadius: '15px',
            maxWidth: '600px'
          }}>
            <h1 style={{ color: '#ff6b6b', marginBottom: '20px' }}>🎬 CineBook</h1>
            <h2 style={{ marginBottom: '20px' }}>Something went wrong!</h2>
            <p style={{ marginBottom: '20px', color: '#a8a8a8' }}>
              Please make sure the backend server is running on port 5001.
            </p>
            <div style={{ 
              background: 'rgba(255, 107, 107, 0.1)', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'left'
            }}>
              <strong>To start the backend server:</strong><br/>
              1. Open a terminal<br/>
              2. Navigate to the server folder: <code>cd server</code><br/>
              3. Run: <code>node server.js</code>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;