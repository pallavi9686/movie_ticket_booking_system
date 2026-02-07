import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

export default function BookingSummary({ summary }){
  const navigate = useNavigate()
  const { addBooking } = useBooking()

  function confirm(){
    addBooking(summary)
    navigate('/checkout', { state: { booking: summary } })
  }

  if(!summary) return null
  const formatINR = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)
  return (
    <div className="summary">
      <h3>Booking Summary</h3>
      <p><strong>Movie:</strong> {summary.movieTitle}</p>
      <p><strong>Showtime:</strong> {summary.showtime}</p>
      <p><strong>Seats:</strong> {summary.seats.join(', ')}</p>
      <p><strong>Total:</strong> {formatINR(summary.total)}</p>
      <button className="button" onClick={confirm}>Confirm Booking</button>
    </div>
  )
}
