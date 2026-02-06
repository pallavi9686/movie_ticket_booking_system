import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'
import { BookingProvider } from './context/BookingContext'

export default function App() {
  return (
    <BookingProvider>
      <div className="app-container">
        <header className="app-header">
          <Link to="/" className="logo">Movie Tickets</Link>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/movie/:id/seats" element={<SeatSelection />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
    </BookingProvider>
  )
}
