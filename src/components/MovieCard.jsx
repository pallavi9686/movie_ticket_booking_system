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
      <div className="poster-wrap">
        <img className="movie-poster" src={movie.poster} alt={movie.title} />
        <div className="rating-badge">⭐ {movie.rating}</div>
        <div className="chip">{movie.genre}</div>

        <div className="overlay">
          <div className="overlay-content">
            <div className="overlay-title">{movie.title}</div>
            <div className="small-note">{movie.duration} • {nextShow ? formatTime(nextShow) : ''}</div>
            <div className="desc">{movie.description}</div>
            <div className="card-actions">
              <Link to={`/movie/${movie.id}`}>
                <button className="button">Details</button>
              </Link>
              <Link to={`/movie/${movie.id}/seats`}>
                <button className={`btn-ghost ${['The Grand Adventure','Romance in Paris','Mystery Manor'].includes(movie.title) ? 'btn-book-blue' : ''}`}>Book Now</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="meta-row">
          <div className="small-note">{movie.genre} • {movie.duration}</div>
          <div className="small-note">⭐ {movie.rating}</div>
        </div>
      </div>
    </div>
  )
}
