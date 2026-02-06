import React, { createContext, useContext, useEffect, useState } from 'react'

const BookingContext = createContext()

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    try {
      const raw = localStorage.getItem('bookings')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings))
  }, [bookings])

  function addBooking(booking) {
    setBookings(prev => [...prev, booking])
  }

  function isSeatBooked(movieId, showtime, seatId) {
    return bookings.some(b => b.movieId === movieId && b.showtime === showtime && b.seats.includes(seatId))
  }

  return (
    <BookingContext.Provider value={{ bookings, addBooking, isSeatBooked }}>
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  return useContext(BookingContext)
}
