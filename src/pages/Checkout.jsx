import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

export default function Checkout(){
  const location = useLocation()
  const navigate = useNavigate()
  const { addBooking } = useBooking()
  const booking = location.state?.booking
  const formatINR = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)

  useEffect(()=>{
    if(!booking){
      // allow reload by checking last booking in localStorage
      const raw = localStorage.getItem('bookings')
      if(raw){
        const arr = JSON.parse(raw)
        if(arr.length>0) {
          navigate('/', { replace: true })
        }
      }
    }
  },[])

  function confirm(){
    if(!booking) return
    addBooking(booking)
    navigate('/', { replace: true })
    alert('Booking confirmed!')
  }

  if(!booking) return <div className="container">No booking to show.</div>

  return (
    <div className="container">
      <h2>Confirm Booking</h2>
      <div className="summary">
        <p><strong>Movie:</strong> {booking.movieTitle}</p>
        <p><strong>Showtime:</strong> {new Date(booking.showtime).toLocaleString()}</p>
        <p><strong>Seats:</strong> {booking.seats.join(', ')}</p>
        <p><strong>Total:</strong> {formatINR(booking.total)}</p>
        <button className="button" onClick={confirm}>Confirm & Save</button>
      </div>
      <p className="footer-note">Saved bookings persist to LocalStorage.</p>
    </div>
  )
}
