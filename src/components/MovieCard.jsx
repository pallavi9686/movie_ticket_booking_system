import React from 'react'
import { Link } from 'react-router-dom'

export default function MovieCard({ movie }) {
  return (
    <div className="card">
      <img className="movie-poster" src={movie.poster} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>{movie.genre} • {movie.duration}</p>
      <p>⭐ {movie.rating}</p>
      <Link to={`/movie/${movie.id}`}>
        <button className="button">View Details</button>
      </Link>
    </div>
  )
}
