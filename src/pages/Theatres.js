import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTheatres } from '../utils/theatreStorage';
import './Theatres.css';

const Theatres = () => {
  const [theatres, setTheatres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTheatres, setFilteredTheatres] = useState([]);

  useEffect(() => {
    const allTheatres = getTheatres();
    setTheatres(allTheatres);
    setFilteredTheatres(allTheatres);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = theatres.filter(theatre =>
        theatre.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theatre.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theatre.facilities.some(facility => 
          facility.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredTheatres(filtered);
    } else {
      setFilteredTheatres(theatres);
    }
  }, [searchQuery, theatres]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="theatres-page">
      <div className="container">
        <div className="theatres-header">
          <h1 className="page-title">Theatres</h1>
          <p className="page-subtitle">Discover premium cinema experiences near you</p>
        </div>

        <div className="search-section">
          <div className="search-bar enhanced">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search theatres by name, location, or facilities..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
              />
            </div>
            {searchQuery && (
              <button 
                className="clear-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {filteredTheatres.length === 0 ? (
          <div className="no-theatres">
            <p>No theatres found matching your search.</p>
            <button onClick={() => setSearchQuery('')} className="btn btn-primary">
              Show All Theatres
            </button>
          </div>
        ) : (
          <div className="theatres-grid">
            {filteredTheatres.map(theatre => (
              <div key={theatre.id} className="theatre-card">
                <div className="theatre-header">
                  <h3 className="theatre-name">{theatre.name}</h3>
                  <div className="theatre-location">
                    <span className="location-icon">📍</span>
                    <span>{theatre.location}</span>
                  </div>
                </div>

                <div className="theatre-details">
                  <div className="theatre-address">
                    <p>{theatre.address}</p>
                  </div>

                  <div className="theatre-screens">
                    <h4>Screens ({theatre.screens.length})</h4>
                    <div className="screens-list">
                      {theatre.screens.map(screen => (
                        <div key={screen.id} className="screen-info">
                          <span className="screen-name">{screen.name}</span>
                          <span className="screen-type">{screen.type}</span>
                          <span className="screen-seats">{screen.totalSeats} seats</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="theatre-facilities">
                    <h4>Facilities</h4>
                    <div className="facilities-list">
                      {theatre.facilities.map(facility => (
                        <span key={facility} className="facility-tag">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="theatre-actions">
                  <Link 
                    to="/movies" 
                    className="btn btn-primary"
                    state={{ selectedTheatre: theatre.id }}
                  >
                    View Movies
                  </Link>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      // Copy address to clipboard
                      navigator.clipboard.writeText(theatre.address);
                      alert('Address copied to clipboard!');
                    }}
                  >
                    📋 Copy Address
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="theatres-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{theatres.length}</div>
              <div className="stat-label">Total Theatres</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {theatres.reduce((total, theatre) => total + theatre.screens.length, 0)}
              </div>
              <div className="stat-label">Total Screens</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {theatres.reduce((total, theatre) => 
                  total + theatre.screens.reduce((screenTotal, screen) => screenTotal + screen.totalSeats, 0), 0
                )}
              </div>
              <div className="stat-label">Total Seats</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {[...new Set(theatres.flatMap(theatre => theatre.facilities))].length}
              </div>
              <div className="stat-label">Unique Facilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theatres;