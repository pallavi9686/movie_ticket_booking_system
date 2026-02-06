import React from 'react'
import { Link } from 'react-router-dom'

function formatTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return ''
  }
}

export default function MovieCard({ movie }) {
  const nextShow = movie.showtimes && movie.showtimes.length ? movie.showtimes[0] : null
  
  return (
    <div className="card movie-card">
      <div className={`poster-wrap ${['The Grand Adventure', 'Romance in Paris', 'Mystery Manor'].includes(movie.title) ? 'medium' : ''}`}>
        <img className="movie-poster" src={movie.poster} alt={movie.title} />
        
        <div className="rating-badge">⭐ {movie.rating}</div>
        <div className="chip">{movie.genre}</div>

        <div className="overlay">
          <div className="overlay-content">
            <h3 className="overlay-title">{movie.title}</h3>
            <div className="overlay-meta">{movie.duration} • {nextShow ? formatTime(nextShow) : 'No showtime'}</div>
            <p className="overlay-description">{movie.description}</p>
            <div className="card-actions">
              <Link to={`/movie/${movie.id}`}>
                <button className="button button-sm">View Details</button>
              </Link>
              <Link to={`/movie/${movie.id}/seats`}>
                <button className="btn-ghost btn-ghost-sm">Book Now</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-info">
        <h3 className="movie-title" style={['Mystery Manor', 'Romance in Paris', 'The Grand Adventure'].includes(movie.title) ? { fontStyle: 'italic' } : {}}>{movie.title}</h3>
        <div className="meta-row">
          <div className="genre-duration">{movie.genre} • {movie.duration}</div>
          <div className="rating-display">⭐ {movie.rating}</div>
        </div>
        <p className="movie-description">{movie.description}</p>
      </div>
    </div>
  )
}
