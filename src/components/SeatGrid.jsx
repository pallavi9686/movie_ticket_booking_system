import React, { useMemo } from 'react'
import { useBooking } from '../context/BookingContext'

export default function SeatGrid({ rows=5, cols=8, bookedSeats=[], selected=[], onToggle }){
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
    <div>
      {seats.map((row,ri)=> (
        <div key={ri} style={{display:'flex'}}>
          {row.map(seatId=>{
            const booked = bookedSeats.includes(seatId)
            const sel = selected.includes(seatId)
            const cls = booked ? 'seat booked' : sel ? 'seat selected' : 'seat available'
            return (
              <div key={seatId} className={cls} onClick={()=>{ if(!booked) onToggle(seatId) }}>
                {seatId}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
