import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import SeatGrid from '../components/SeatGrid'
import BookingSummary from '../components/BookingSummary'
import { useBooking } from '../context/BookingContext'

export default function SeatSelection(){
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isSeatBooked } = useBooking()
  const [movie, setMovie] = useState(location.state?.movie || null)
  const [showtime, setShowtime] = useState(location.state?.showtime || '')
  const [selected, setSelected] = useState([])
  const [bookedSeats, setBookedSeats] = useState([])
  const PRICE = 8

  useEffect(()=>{
    if(!movie){
      fetch('/src/data/movies.json').then(r=>r.json()).then(list=>{
        const found = list.find(m=>m.id===id)
        setMovie(found)
      })
    }
  },[id, movie])

  useEffect(()=>{
    if(movie && showtime){
      // gather booked seats for this movie+showtime from localStorage via a helper (we'll compute simple)
      const raw = localStorage.getItem('bookings')
      if(raw){
        const arr = JSON.parse(raw)
        const seats = arr.filter(b=>b.movieId===movie.id && b.showtime===showtime).flatMap(b=>b.seats)
        setBookedSeats(seats)
      }
    }
  },[movie, showtime])

  function toggle(seatId){
    setSelected(s=> s.includes(seatId) ? s.filter(x=>x!==seatId) : [...s,seatId])
  }

  function toSummary(){
    if(!movie || !showtime || selected.length===0) return alert('Choose seats and showtime')
    const total = selected.length * 8 // price per seat
    const summary = { movieId: movie.id, movieTitle: movie.title, showtime, seats: selected, total }
    navigate('/checkout', { state: { booking: summary } })
  }

  if(!movie) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <h2>{movie.title} — Seat selection</h2>
      <div style={{marginBottom:12}}>
        <label>Select showtime: </label>
        <select value={showtime} onChange={e=>setShowtime(e.target.value)}>
          <option value="">-- pick --</option>
          {movie.showtimes.map(s=> <option key={s} value={s}>{new Date(s).toLocaleString()}</option>)}
        </select>
      </div>

      <div style={{display:'flex',gap:20,alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          <div className="seat-map-wrapper">
            <div className="legend">
              <div className="item"><span className="swatch available"/> Available</div>
              <div className="item"><span className="swatch selected"/> Selected</div>
              <div className="item"><span className="swatch booked"/> Booked</div>
            </div>
            {!showtime && <div className="seat-note">Choose a showtime to enable seat selection and see booked seats.</div>}
            <SeatGrid rows={6} cols={8} bookedSeats={bookedSeats} selected={selected} onToggle={toggle} disabled={!showtime} />
          </div>
        </div>
        <div style={{width:320}}>
          <div className="summary">
            <h4>Selected seats</h4>
            <p>{selected.join(', ') || 'No seats selected'}</p>
            <p><strong>Total:</strong> ${selected.length * PRICE}</p>
            <p className="footer-note">Price per seat: ${PRICE}</p>
            <button className="button" onClick={toSummary} disabled={selected.length===0}>Proceed</button>
          </div>
        </div>
      </div>
    </div>
  )
}
