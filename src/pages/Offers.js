import React, { useState, useEffect } from 'react';
import { getCoupons } from '../utils/api';
import './Offers.css';

const Offers = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code) => {
    // Check if clipboard API is available
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopiedCode(code);
          setTimeout(() => setCopiedCode(null), 2000);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          // Fallback method
          fallbackCopyToClipboard(code);
        });
    } else {
      // Fallback for browsers that don't support clipboard API
      fallbackCopyToClipboard(code);
    }
  };

  const fallbackCopyToClipboard = (code) => {
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert(`Copy this code: ${code}`);
    }
    
    document.body.removeChild(textArea);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="offers-page">
        <div className="loading">Loading offers...</div>
      </div>
    );
  }

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h1>🎉 Special Offers & Coupons</h1>
        <p>Save more on your movie bookings with our exclusive deals!</p>
      </div>

      {coupons.length === 0 ? (
        <div className="no-offers">
          <p>No active offers at the moment. Check back soon!</p>
        </div>
      ) : (
        <div className="offers-grid">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="offer-card">
              <div className="offer-badge">
                {coupon.discount_percentage 
                  ? `${coupon.discount_percentage}% OFF`
                  : `₹${coupon.discount_amount} OFF`
                }
              </div>
              
              <div className="offer-content">
                <div className="coupon-code-section">
                  <span className="code-label">Coupon Code</span>
                  <div className="code-display">
                    <span className="code">{coupon.code}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard(coupon.code)}
                    >
                      {copiedCode === coupon.code ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>

                <div className="offer-details">
                  <div className="detail-item">
                    <span className="detail-label">Max Usage:</span>
                    <span className="detail-value">{coupon.max_usage} times</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Used:</span>
                    <span className="detail-value">{coupon.usage_count} times</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Valid Until:</span>
                    <span className="detail-value">{formatDate(coupon.expiry_date)}</span>
                  </div>
                </div>

                <div className="offer-footer">
                  <span className="remaining">
                    {coupon.max_usage - coupon.usage_count} uses remaining
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Offers;
