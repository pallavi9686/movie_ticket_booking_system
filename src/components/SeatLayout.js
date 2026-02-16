import React from 'react';
import './SeatLayout.css';

const SeatLayout = ({ selectedSeats, bookedSeats, onSeatSelect, movie }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seatsPerRow = 10;

  const isSeatBooked = (seat) => bookedSeats.includes(seat);
  const isSeatSelected = (seat) => selectedSeats.includes(seat);

  const handleSeatClick = (seat) => {
    if (!isSeatBooked(seat)) {
      onSeatSelect(seat);
    }
  };

  const handleQuickSelect = (rowType) => {
    let targetRows = [];
    switch (rowType) {
      case 'front':
        targetRows = ['A', 'B'];
        break;
      case 'middle':
        targetRows = ['C', 'D'];
        break;
      case 'back':
        targetRows = ['E', 'F'];
        break;
      default:
        return;
    }

    // Find available seats in target rows
    const availableSeats = [];
    targetRows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        if (!isSeatBooked(seatId)) {
          availableSeats.push(seatId);
        }
      }
    });

    // Select up to 2 best seats (center seats preferred)
    const centerSeats = availableSeats.filter(seat => {
      const seatNum = parseInt(seat.slice(1));
      return seatNum >= 4 && seatNum <= 7; // Center seats
    });

    const seatsToSelect = centerSeats.length >= 2 
      ? centerSeats.slice(0, 2) 
      : availableSeats.slice(0, 2);

    // Clear current selection and select new seats
    selectedSeats.forEach(seat => onSeatSelect(seat)); // Deselect current
    seatsToSelect.forEach(seat => onSeatSelect(seat)); // Select new
  };

  const getSeatPrice = (seat) => {
    if (!movie) return 0;
    const row = seat.charAt(0);
    const multiplier = ['A', 'B'].includes(row) ? 0.8 : ['C', 'D'].includes(row) ? 1.0 : 1.2;
    return movie.price * multiplier;
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
        <h4>💰 Seat Pricing - Click to Auto-Select!</h4>
        <div className="pricing-tiers">
          <div 
            className="pricing-tier front-seats clickable" 
            onClick={() => handleQuickSelect('front')}
            title="Click to auto-select 2 best front seats"
          >
            <div className="tier-info">
              <span className="tier-label">🎟️ Front Seats (A-B)</span>
              {movie && <span className="tier-actual-price">₹{(movie.price * 0.8).toFixed(0)} per seat</span>}
            </div>
            <span className="tier-discount">20% OFF - Click to Select!</span>
          </div>
          <div 
            className="pricing-tier middle-seats clickable" 
            onClick={() => handleQuickSelect('middle')}
            title="Click to auto-select 2 best middle seats"
          >
            <div className="tier-info">
              <span className="tier-label">🎟️ Middle Seats (C-D)</span>
              {movie && <span className="tier-actual-price">₹{movie.price} per seat</span>}
            </div>
            <span className="tier-price">Standard Price - Click to Select!</span>
          </div>
          <div 
            className="pricing-tier back-seats clickable" 
            onClick={() => handleQuickSelect('back')}
            title="Click to auto-select 2 best back seats"
          >
            <div className="tier-info">
              <span className="tier-label">🎟️ Back Seats (E-F)</span>
              {movie && <span className="tier-actual-price">₹{(movie.price * 1.2).toFixed(0)} per seat</span>}
            </div>
            <span className="tier-premium">+20% Premium - Click to Select!</span>
          </div>
        </div>
        <div className="quick-select-info">
          <p>💡 Click any pricing tier above to automatically select 2 best available seats in that section!</p>
          <p>🎯 Front seats offer the best value with 20% discount!</p>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
