import React, { useMemo } from 'react'
import { useBooking } from '../context/BookingContext'

export default function SeatGrid({ rows=5, cols=8, bookedSeats=[], selected=[], onToggle, disabled=false }){
  const { isSeatBooked } = useBooking()

  const seats = useMemo(()=>{
    const arr = []
    for(let r=0;r<rows;r++){
      const row = []
      for(let c=0;c<cols;c++){
        const id = String.fromCharCode(65+r)+(c+1)
        row.push(id)
      }
      arr.push(row)
    }
    return arr
  },[rows,cols])

  return (
    <div className="seat-map">
      <div className="seat-note">Click seats to select — use keyboard (Tab + Enter) for accessibility</div>
      <div className="seat-grid">
        {seats.map((row,ri)=> (
          <div key={ri} className="seat-row">
            <div className="row-label">{String.fromCharCode(65+ri)}</div>
            {row.map(seatId=>{
              const booked = bookedSeats.includes(seatId)
              const sel = selected.includes(seatId)
              const base = booked ? 'seat booked' : sel ? 'seat selected' : 'seat available'
              const cls = `${base}${disabled ? ' disabled' : ''}`
              return (
                <button
                  key={seatId}
                  className={cls}
                  onClick={()=>{ if(!booked && !disabled) onToggle(seatId) }}
                  disabled={booked || disabled}
                  aria-pressed={sel}
                  aria-disabled={booked || disabled}
                  title={`${seatId} — ${booked ? 'Booked' : sel ? 'Selected' : 'Available'} • $8`}
                >
                  {seatId}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
