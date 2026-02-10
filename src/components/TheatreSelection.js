import React, { useState, useEffect } from 'react';
import { getTheatresForMovie } from '../utils/theatreStorage';
import './TheatreSelection.css';

const TheatreSelection = ({ movieId, selectedDate, onTheatreSelect, onShowSelect }) => {
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    if (movieId && selectedDate) {
      const theatresWithShows = getTheatresForMovie(movieId, selectedDate);
      setTheatres(theatresWithShows);
      setSelectedTheatre(null);
      setSelectedShow(null);
    }
  }, [movieId, selectedDate]);

  const handleTheatreSelect = (theatre) => {
    setSelectedTheatre(theatre);
    setSelectedShow(null);
    onTheatreSelect(theatre);
  };

  const handleShowSelect = (show) => {
    setSelectedShow(show);
    onShowSelect(show);
  };

  if (theatres.length === 0) {
    return (
      <div className="theatre-selection">
        <div className="no-shows">
          <p>No shows available for the selected date.</p>
          <p>Please select a different date.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theatre-selection">
      <h3>Select Theatre & Show Time</h3>
      
      <div className="theatres-list">
        {theatres.map(theatre => (
          <div key={theatre.id} className="theatre-card">
            <div className="theatre-header">
              <div className="theatre-info">
                <h4 className="theatre-name">{theatre.name}</h4>
                <p className="theatre-location">📍 {theatre.location}</p>
                <div className="theatre-facilities">
                  {theatre.facilities.slice(0, 3).map(facility => (
                    <span key={facility} className="facility-tag">{facility}</span>
                  ))}
                  {theatre.facilities.length > 3 && (
                    <span className="facility-more">+{theatre.facilities.length - 3} more</span>
                  )}
                </div>
              </div>
              <div className="theatre-actions">
                <button 
                  className={`theatre-select-btn ${selectedTheatre?.id === theatre.id ? 'active' : ''}`}
                  onClick={() => handleTheatreSelect(theatre)}
                >
                  {selectedTheatre?.id === theatre.id ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>

            {selectedTheatre?.id === theatre.id && (
              <div className="shows-section">
                <h5>Available Shows</h5>
                <div className="shows-grid">
                  {theatre.shows.map(show => {
                    const screen = theatre.screens.find(s => s.id === show.screenId);
                    return (
                      <div 
                        key={show.id} 
                        className={`show-card ${selectedShow?.id === show.id ? 'selected' : ''}`}
                        onClick={() => handleShowSelect(show)}
                      >
                        <div className="show-time">{show.showTime}</div>
                        <div className="show-details">
                          <span className="screen-name">{screen?.name}</span>
                          <span className="screen-type">{screen?.type}</span>
                        </div>
                        <div className="show-price">₹{show.basePrice}</div>
                        <div className="available-seats">
                          {screen?.totalSeats - (show.bookedSeats || 0)} seats available
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatreSelection;