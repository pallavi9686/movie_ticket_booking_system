import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function MovieDetails(){
  const { id } = useParams()
  const [movie, setMovie] = useState(null)

  useEffect(()=>{
    fetch('/src/data/movies.json').then(r=>r.json()).then(list=>{
      const found = list.find(m=>m.id===id)
      setMovie(found)
    })
  },[id])

  if(!movie) return <div className="container">Loading...</div>

  return (
    <div className="container">
      <div className="details-grid">
        <img src={movie.poster} className="poster" alt="poster" />
        <div>
          <h2>{movie.title}</h2>
          <p>{movie.genre} • {movie.duration} • ⭐ {movie.rating}</p>
          <p>{movie.description}</p>
          <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          <div style={{marginTop:12}}>
            <h4>Showtimes</h4>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {movie.showtimes.map(s=> (
                <Link key={s} to={`/movie/${movie.id}/seats`} state={{ showtime: s, movie }}>
                  <button className="button">{new Date(s).toLocaleString()}</button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{marginTop:20}}>
        <h4>Trailer</h4>
        <div style={{aspectRatio:'16/9'}}>
          <iframe width="100%" height="360" src={movie.trailer} title="trailer" frameBorder="0" allowFullScreen />
        </div>
      </div>
    </div>
  )
}
