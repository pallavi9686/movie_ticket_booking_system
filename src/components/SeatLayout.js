import React from 'react';
import './SeatLayout.css';

const SeatLayout = ({ selectedSeats, bookedSeats, onSeatSelect }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 10;

  const isSeatBooked = (seat) => bookedSeats.includes(seat);
  const isSeatSelected = (seat) => selectedSeats.includes(seat);

  const handleSeatClick = (seat) => {
    if (!isSeatBooked(seat)) {
      onSeatSelect(seat);
    }
  };

  return (
    <div className="seat-layout">
      <div className="screen">
        <div className="screen-label">SCREEN</div>
      </div>
      
      <div className="seats-container">
        {rows.map(row => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            {[...Array(seatsPerRow)].map((_, index) => {
              const seatNumber = index + 1;
              const seatId = `${row}${seatNumber}`;
              const booked = isSeatBooked(seatId);
              const selected = isSeatSelected(seatId);
              
              return (
                <div
                  key={seatId}
                  className={`seat ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(seatId)}
                  title={seatId}
                >
                  {seatNumber}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Your Selection</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Booked</span>
        </div>
      </div>
      
      <div className="pricing-info">
        <h4>Seat Pricing</h4>
        <p>🎟️ Rows A-B: 20% discount (Front seats)</p>
        <p>🎟️ Rows C-D: Standard price (Middle seats)</p>
        <p>🎟️ Rows E-F: 20% premium (Back seats)</p>
      </div>
    </div>
  );
};

export default SeatLayout;
