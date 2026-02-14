import React, { useState } from 'react';
import './Theaters.css';

const Theaters = () => {
  const [selectedCity, setSelectedCity] = useState('All');

  const theaters = [
    {
      id: 1,
      name: 'PVR Cinemas',
      location: 'Phoenix Mall, Mumbai',
      city: 'Mumbai',
      screens: 8,
      facilities: ['IMAX', '4DX', 'Dolby Atmos', 'Recliner Seats'],
      image: '🎭',
      rating: 4.5
    },
    {
      id: 2,
      name: 'INOX Megaplex',
      location: 'Select City Walk, Delhi',
      city: 'Delhi',
      screens: 12,
      facilities: ['IMAX', 'Dolby Atmos', 'Premium Lounge', 'Food Court'],
      image: '🎪',
      rating: 4.3
    },
    {
      id: 3,
      name: 'Cinepolis',
      location: 'Forum Mall, Bangalore',
      city: 'Bangalore',
      screens: 6,
      facilities: ['4DX', 'VIP Seats', 'Dolby Atmos', 'Cafe'],
      image: '🎬',
      rating: 4.4
    },
    {
      id: 4,
      name: 'Carnival Cinemas',
      location: 'Nexus Mall, Pune',
      city: 'Pune',
      screens: 5,
      facilities: ['Dolby Atmos', 'Recliner Seats', 'Parking'],
      image: '🎞️',
      rating: 4.2
    },
    {
      id: 5,
      name: 'PVR Director\'s Cut',
      location: 'Ambience Mall, Gurgaon',
      city: 'Delhi',
      screens: 4,
      facilities: ['Premium Lounge', 'Gourmet Menu', 'Recliner Seats', 'Valet Parking'],
      image: '🎭',
      rating: 4.7
    },
    {
      id: 6,
      name: 'INOX Insignia',
      location: 'Palladium Mall, Mumbai',
      city: 'Mumbai',
      screens: 3,
      facilities: ['Luxury Seats', 'Fine Dining', 'Private Lounge', 'Butler Service'],
      image: '🎪',
      rating: 4.8
    },
    {
      id: 7,
      name: 'Cinepolis VIP',
      location: 'Orion Mall, Bangalore',
      city: 'Bangalore',
      screens: 7,
      facilities: ['4DX', 'IMAX', 'Recliner Seats', 'Food Court'],
      image: '🎬',
      rating: 4.5
    },
    {
      id: 8,
      name: 'Miraj Cinemas',
      location: 'Seasons Mall, Pune',
      city: 'Pune',
      screens: 4,
      facilities: ['Dolby Atmos', 'Comfortable Seating', 'Snack Bar'],
      image: '🎞️',
      rating: 4.1
    }
  ];

  const cities = ['All', ...new Set(theaters.map(t => t.city))];

  const filteredTheaters = selectedCity === 'All' 
    ? theaters 
    : theaters.filter(t => t.city === selectedCity);

  return (
    <div className="theaters-page">
      <div className="theaters-header">
        <h1>🎭 Our Theaters</h1>
        <p>Experience cinema at its finest in our premium theaters</p>
      </div>

      <div className="city-filter">
        <label>Filter by City:</label>
        <div className="city-buttons">
          {cities.map(city => (
            <button
              key={city}
              className={`city-btn ${selectedCity === city ? 'active' : ''}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="theaters-grid">
        {filteredTheaters.map(theater => (
          <div key={theater.id} className="theater-card">
            <div className="theater-icon">{theater.image}</div>
            <div className="theater-info">
              <h2>{theater.name}</h2>
              <p className="theater-location">📍 {theater.location}</p>
              <p className="theater-screens">🎬 {theater.screens} Screens</p>
              <div className="theater-rating">
                ⭐ {theater.rating} / 5.0
              </div>
              <div className="theater-facilities">
                <h4>Facilities:</h4>
                <div className="facilities-list">
                  {theater.facilities.map((facility, index) => (
                    <span key={index} className="facility-tag">
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTheaters.length === 0 && (
        <div className="no-theaters">
          <p>No theaters found in this city.</p>
        </div>
      )}
    </div>
  );
};

export default Theaters;
