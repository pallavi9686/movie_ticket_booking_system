import React, { useState } from 'react';
import './Auth.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book tickets?",
      answer: "Select a movie, choose your show time and date, pick your seats, and complete the payment process."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking from the 'My Bookings' section. Refunds will be processed within 5-7 business days."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Credit/Debit Cards, UPI payments, and Cash at Counter."
    },
    {
      question: "How does seat pricing work?",
      answer: "Front rows (A-B) have 20% discount, middle rows (C-D) are standard price, and back rows (E-F) have 20% premium."
    },
    {
      question: "Can I apply discount coupons?",
      answer: "Yes! Enter your coupon code during the booking process before payment to get discounts."
    },
    {
      question: "How do I get my tickets?",
      answer: "After successful payment, your booking confirmation will be available in 'My Bookings'. Show this at the cinema counter."
    },
    {
      question: "What if I forget my password?",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions to reset your password."
    },
    {
      question: "Can I book multiple seats?",
      answer: "Yes, you can select and book multiple seats in a single transaction."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="auth-page">
      <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
        <h1 style={{ color: '#fff', marginBottom: '30px' }}>Frequently Asked Questions</h1>
        
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '30px', borderRadius: '15px' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '20px', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                paddingBottom: '20px'
              }}
            >
              <div 
                onClick={() => toggleFAQ(index)}
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#ffd700',
                  fontWeight: '600',
                  fontSize: '18px'
                }}
              >
                <span>{faq.question}</span>
                <span style={{ fontSize: '24px' }}>{openIndex === index ? '−' : '+'}</span>
              </div>
              {openIndex === index && (
                <p style={{ 
                  marginTop: '15px', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6'
                }}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
