import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Theaters from './pages/Theaters';
import Offers from './pages/Offers';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import BookingDetails from './pages/BookingDetails';
<<<<<<< HEAD
=======
import Releases from './pages/Releases';
import HelpCenter from './pages/HelpCenter';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
>>>>>>> origin
import { initializeApp } from './utils/storage';
import './App.css';

function AppContent() {
  const location = useLocation();
  const showFooterPages = ['/', '/admin'];
  const showFooter = showFooterPages.includes(location.pathname);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/releases" element={<Releases />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/theaters" element={<Theaters />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;
