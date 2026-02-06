import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { BookingProvider } from './context/BookingContext'
import { AuthProvider, useAuth } from './context/AuthContext'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/signin" replace />
}

function AppContent() {
  const { user } = useAuth()

  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="logo">🎬 Movie Tickets</Link>
        <div className="header-right">
          {user ? (
            <div className="user-info">
              <span className="user-name">Welcome, {user.name}!</span>
              <Link to="/profile" className="profile-link">Profile</Link>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/signin" className="auth-link">Sign In</Link>
              <Link to="/signup" className="auth-link signup">Sign Up</Link>
            </div>
          )}
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={user ? <Navigate to="/" /> : <SignIn />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignUp />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/movie/:id/seats" element={<SeatSelection />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <AppContent />
      </BookingProvider>
    </AuthProvider>
  )
}
