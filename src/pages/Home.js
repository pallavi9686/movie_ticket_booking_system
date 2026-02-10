import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMovies } from '../utils/api';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div className="home">
      {/* Hero Carousel */}
      <section className="hero-carousel">
        {movies.length > 0 && (
          <div className="carousel-container">
            <div className="carousel-slide" style={{ backgroundImage: `url(${movies[currentSlide].poster})` }}>
              <div className="carousel-overlay">
                <div className="carousel-content">
                  <h1 className="carousel-title">{movies[currentSlide].title}</h1>
                  <p className="carousel-subtitle">{movies[currentSlide].description}</p>
                  <div className="carousel-meta">
                    <span>⭐ {movies[currentSlide].rating}</span>
                    <span>🕐 {movies[currentSlide].duration}</span>
                    <span>🎭 {movies[currentSlide].genre}</span>
                  </div>
                  <Link to={`/movie/${movies[currentSlide].id}`} className="btn btn-primary">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
            
            <button className="carousel-btn prev" onClick={prevSlide}>❮</button>
            <button className="carousel-btn next" onClick={nextSlide}>❯</button>
            
            <div className="carousel-indicators">
              {movies.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for an Amazing Movie Experience?</h2>
            <p>Book your tickets now and enjoy exclusive discounts!</p>
            <Link to="/movies" className="btn btn-primary btn-large">
              Explore All Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose CineBook?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎬</div>
              <h3>Latest Movies</h3>
              <p>Watch the latest blockbusters and trending movies from around the world</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Easy Booking</h3>
              <p>Book your seats in just a few clicks with our intuitive interface</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💺</div>
              <h3>Real-Time Availability</h3>
              <p>See available seats in real-time with dynamic pricing</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Great Deals</h3>
              <p>Enjoy exclusive discounts and coupon codes on every booking</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Multiple payment options with secure transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Premium Experience</h3>
              <p>Premium cinema experience with best seats and service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-number">10K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">500+</h3>
              <p>Movies Available</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">50+</h3>
              <p>Cinema Partners</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">100K+</h3>
              <p>Bookings Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Browse Movies</h3>
              <p>Explore our collection of latest and trending movies</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Select Seats</h3>
              <p>Choose your preferred seats with real-time availability</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Apply Coupon</h3>
              <p>Get discounts with our exclusive coupon codes</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Pay & Confirm</h3>
              <p>Complete payment and get instant confirmation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"CineBook made booking tickets so easy! The interface is intuitive and the discounts are amazing."</p>
              <h4>- Sarah Johnson</h4>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Best movie booking platform I've used. Fast, secure, and great customer service!"</p>
              <h4>- Mike Chen</h4>
            </div>
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"Love the seat selection feature and the real-time availability. Highly recommended!"</p>
              <h4>- Emma Davis</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get exclusive deals and updates about new movies</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
