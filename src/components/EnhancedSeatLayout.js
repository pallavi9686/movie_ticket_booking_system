import React from 'react';
import './EnhancedSeatLayout.css';

const EnhancedSeatLayout = ({ 
  theatre, 
  screen, 
  selectedSeats, 
  bookedSeats, 
  onSeatSelect,
  basePrice 
}) => {
  if (!screen || !screen.seatLayout) {
    return <div>Loading seat layout...</div>;
  }

  const { rows, seatsPerRow, premiumRows, standardRows, economyRows } = screen.seatLayout;

  const isSeatBooked = (seat) => bookedSeats.includes(seat);
  const isSeatSelected = (seat) => selectedSeats.includes(seat);

  const getSeatCategory = (row) => {
    if (premiumRows.includes(row)) return 'premium';
    if (standardRows.includes(row)) return 'standard';
    if (economyRows.includes(row)) return 'economy';
    return 'standard';
  };

  const getSeatPrice = (seat) => {
    const row = seat.charAt(0);
    const category = getSeatCategory(row);
    
    let multiplier = 1.0;
    switch (category) {
      case 'premium': multiplier = 1.5; break;
      case 'standard': multiplier = 1.0; break;
      case 'economy': multiplier = 0.8; break;
      default: multiplier = 1.0;
    }
    
    // Screen type multiplier
    const screenMultiplier = {
      'IMAX': 1.8,
      '4DX': 2.0,
      'Premium': 1.3,
      'Standard': 1.0
    };
    
    return Math.round(basePrice * multiplier * (screenMultiplier[screen.type] || 1.0));
  };

  const handleSeatClick = (seat) => {
    if (!isSeatBooked(seat)) {
      onSeatSelect(seat);
    }
  };

  return (
    <div className="enhanced-seat-layout">
      <div className="screen-info">
        <div className="screen">
          <div className="screen-label">
            {screen.name} - {screen.type}
          </div>
        </div>
        <div className="theatre-info">
          <h4>{theatre.name}</h4>
          <p>{theatre.location}</p>
        </div>
      </div>
      
      <div className="seats-container">
        {rows.map(row => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats-in-row">
              {[...Array(seatsPerRow)].map((_, index) => {
                const seatNumber = index + 1;
                const seatId = `${row}${seatNumber}`;
                const booked = isSeatBooked(seatId);
                const selected = isSeatSelected(seatId);
                const category = getSeatCategory(row);
                const price = getSeatPrice(seatId);
                
                return (
                  <div
                    key={seatId}
                    className={`seat ${category} ${booked ? 'booked' : ''} ${selected ? 'selected' : ''}`}
                    onClick={() => handleSeatClick(seatId)}
                    title={`${seatId} - ₹${price} (${category})`}
                  >
                    {seatNumber}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-section">
          <h5>Seat Categories</h5>
          <div className="legend-items">
            <div className="legend-item">
              <div className="seat premium available"></div>
              <span>Premium - ₹{Math.round(basePrice * 1.5 * (screen.type === 'IMAX' ? 1.8 : screen.type === '4DX' ? 2.0 : screen.type === 'Premium' ? 1.3 : 1.0))}</span>
            </div>
            <div className="legend-item">
              <div className="seat standard available"></div>
              <span>Standard - ₹{Math.round(basePrice * (screen.type === 'IMAX' ? 1.8 : screen.type === '4DX' ? 2.0 : screen.type === 'Premium' ? 1.3 : 1.0))}</span>
            </div>
            <div className="legend-item">
              <div className="seat economy available"></div>
              <span>Economy - ₹{Math.round(basePrice * 0.8 * (screen.type === 'IMAX' ? 1.8 : screen.type === '4DX' ? 2.0 : screen.type === 'Premium' ? 1.3 : 1.0))}</span>
            </div>
          </div>
        </div>
        
        <div className="legend-section">
          <h5>Seat Status</h5>
          <div className="legend-items">
            <div className="legend-item">
              <div className="seat standard available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="seat standard selected"></div>
              <span>Your Selection</span>
            </div>
            <div className="legend-item">
              <div className="seat standard booked"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pricing-info">
        <h4>Screen Information</h4>
        <div className="screen-details">
          <p><strong>Screen Type:</strong> {screen.type}</p>
          <p><strong>Total Seats:</strong> {screen.totalSeats}</p>
          <p><strong>Theatre:</strong> {theatre.name}</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSeatLayout;