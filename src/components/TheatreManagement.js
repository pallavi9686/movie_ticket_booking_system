import React, { useState, useEffect } from 'react';
import { 
  getTheatres, 
  addTheatre, 
  updateTheatre, 
  deleteTheatre,
  getTheatreShows,
  addTheatreShow,
  deleteTheatreShow
} from '../utils/theatreStorage';
import { getMovies } from '../utils/storage';
import './TheatreManagement.css';

const TheatreManagement = () => {
  const [activeTab, setActiveTab] = useState('theatres');
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [theatreForm, setTheatreForm] = useState({
    name: '',
    location: '',
    address: '',
    facilities: '',
    screens: []
  });

  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    showDate: '',
    showTime: '',
    basePrice: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTheatres(getTheatres());
    setShows(getTheatreShows());
    setMovies(getMovies());
  };

  const handleTheatreFormChange = (e) => {
    setTheatreForm({ ...theatreForm, [e.target.name]: e.target.value });
  };

  const handleShowFormChange = (e) => {
    setShowForm({ ...showForm, [e.target.name]: e.target.value });
  };

  const handleAddTheatre = (e) => {
    e.preventDefault();
    
    const theatreData = {
      ...theatreForm,
      facilities: theatreForm.facilities.split(',').map(f => f.trim()),
      screens: [
        {
          id: 'screen1',
          name: 'Screen 1',
          type: 'Standard',
          totalSeats: 80,
          seatLayout: {
            rows: ['A', 'B', 'C', 'D', 'E', 'F'],
            seatsPerRow: 14,
            premiumRows: ['E', 'F'],
            standardRows: ['C', 'D'],
            economyRows: ['A', 'B']
          }
        }
      ]
    };

    if (editingTheatre) {
      updateTheatre(editingTheatre.id, theatreData);
      setMessage({ type: 'success', text: 'Theatre updated successfully!' });
      setEditingTheatre(null);
    } else {
      addTheatre(theatreData);
      setMessage({ type: 'success', text: 'Theatre added successfully!' });
    }

    setTheatreForm({
      name: '',
      location: '',
      address: '',
      facilities: '',
      screens: []
    });
    
    loadData();
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleEditTheatre = (theatre) => {
    setEditingTheatre(theatre);
    setTheatreForm({
      name: theatre.name,
      location: theatre.location,
      address: theatre.address,
      facilities: theatre.facilities.join(', '),
      screens: theatre.screens
    });
  };

  const handleDeleteTheatre = (id) => {
    if (window.confirm('Are you sure you want to delete this theatre?')) {
      deleteTheatre(id);
      loadData();
      setMessage({ type: 'success', text: 'Theatre deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleAddShow = (e) => {
    e.preventDefault();
    
    const showData = {
      ...showForm,
      basePrice: parseFloat(showForm.basePrice)
    };

    addTheatreShow(showData);
    setMessage({ type: 'success', text: 'Show added successfully!' });
    
    setShowForm({
      movieId: '',
      theatreId: '',
      screenId: '',
      showDate: '',
      showTime: '',
      basePrice: ''
    });
    
    loadData();
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleDeleteShow = (showId) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      deleteTheatreShow(showId);
      loadData();
      setMessage({ type: 'success', text: 'Show deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getTheatreById = (id) => {
    return theatres.find(t => t.id === id);
  };

  const getMovieById = (id) => {
    return movies.find(m => m.id === id);
  };

  return (
    <div className="theatre-management">
      {message.text && (
        <div className={`${message.type}-message`}>
          {message.text}
        </div>
      )}

      <div className="management-tabs">
        <button
          className={`tab-btn ${activeTab === 'theatres' ? 'active' : ''}`}
          onClick={() => setActiveTab('theatres')}
        >
          Manage Theatres
        </button>
        <button
          className={`tab-btn ${activeTab === 'shows' ? 'active' : ''}`}
          onClick={() => setActiveTab('shows')}
        >
          Manage Shows
        </button>
      </div>

      {activeTab === 'theatres' && (
        <div className="theatres-section">
          <h3>Theatre Management</h3>
          
          <form onSubmit={handleAddTheatre} className="theatre-form">
            <div className="form-row">
              <div className="form-group">
                <label>Theatre Name</label>
                <input
                  type="text"
                  name="name"
                  value={theatreForm.name}
                  onChange={handleTheatreFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={theatreForm.location}
                  onChange={handleTheatreFormChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={theatreForm.address}
                onChange={handleTheatreFormChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Facilities (comma separated)</label>
              <input
                type="text"
                name="facilities"
                value={theatreForm.facilities}
                onChange={handleTheatreFormChange}
                placeholder="Dolby Atmos, Recliner Seats, Food Court"
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              {editingTheatre ? 'Update Theatre' : 'Add Theatre'}
            </button>
            
            {editingTheatre && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setEditingTheatre(null);
                  setTheatreForm({
                    name: '',
                    location: '',
                    address: '',
                    facilities: '',
                    screens: []
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="theatres-grid">
            {theatres.map(theatre => (
              <div key={theatre.id} className="theatre-card">
                <h4>{theatre.name}</h4>
                <p>📍 {theatre.location}</p>
                <p>🏢 {theatre.address}</p>
                <div className="facilities">
                  {theatre.facilities.map(facility => (
                    <span key={facility} className="facility-tag">{facility}</span>
                  ))}
                </div>
                <div className="screens-info">
                  <strong>Screens: {theatre.screens.length}</strong>
                </div>
                <div className="theatre-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleEditTheatre(theatre)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDeleteTheatre(theatre.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'shows' && (
        <div className="shows-section">
          <h3>Show Management</h3>
          
          <form onSubmit={handleAddShow} className="show-form">
            <div className="form-row">
              <div className="form-group">
                <label>Movie</label>
                <select
                  name="movieId"
                  value={showForm.movieId}
                  onChange={handleShowFormChange}
                  required
                >
                  <option value="">Select Movie</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Theatre</label>
                <select
                  name="theatreId"
                  value={showForm.theatreId}
                  onChange={handleShowFormChange}
                  required
                >
                  <option value="">Select Theatre</option>
                  {theatres.map(theatre => (
                    <option key={theatre.id} value={theatre.id}>
                      {theatre.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Screen</label>
                <select
                  name="screenId"
                  value={showForm.screenId}
                  onChange={handleShowFormChange}
                  required
                >
                  <option value="">Select Screen</option>
                  {showForm.theatreId && getTheatreById(showForm.theatreId)?.screens.map(screen => (
                    <option key={screen.id} value={screen.id}>
                      {screen.name} ({screen.type})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Show Date</label>
                <input
                  type="date"
                  name="showDate"
                  value={showForm.showDate}
                  onChange={handleShowFormChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Show Time</label>
                <input
                  type="time"
                  name="showTime"
                  value={showForm.showTime}
                  onChange={handleShowFormChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Base Price (₹)</label>
                <input
                  type="number"
                  name="basePrice"
                  value={showForm.basePrice}
                  onChange={handleShowFormChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary">
              Add Show
            </button>
          </form>

          <div className="shows-table">
            <table>
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Screen</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shows.map(show => {
                  const movie = getMovieById(show.movieId);
                  const theatre = getTheatreById(show.theatreId);
                  const screen = theatre?.screens.find(s => s.id === show.screenId);
                  
                  return (
                    <tr key={show.id}>
                      <td>{movie?.title || 'Unknown'}</td>
                      <td>{theatre?.name || 'Unknown'}</td>
                      <td>{screen?.name || 'Unknown'}</td>
                      <td>{show.showDate}</td>
                      <td>{show.showTime}</td>
                      <td>₹{show.basePrice}</td>
                      <td>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteShow(show.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TheatreManagement;