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
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,alignItems:'start'}}>
        {/* Left Column - Poster */}
        <div>
          <img src={movie.poster} style={{width:'100%',borderRadius:8}} alt="poster" />
        </div>
        
        {/* Right Column - Movie Info */}
        <div>
          <h2>{movie.title}</h2>
          <p style={{fontSize:'16px',color:'#666',marginBottom:16}}>{movie.genre} • {movie.duration} • ⭐ {movie.rating}</p>
          <p style={{lineHeight:1.6,marginBottom:16}}>{movie.description}</p>
          <p style={{marginBottom:16}}><strong>Cast:</strong> {movie.cast.join(', ')}</p>
          <div style={{marginTop:24}}>
            <h4>Showtimes</h4>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:12}}>
              {movie.showtimes.map(s=> (
                <Link key={s} to={`/movie/${movie.id}/seats`} state={{ showtime: s, movie }}>
                  <button className="button">{new Date(s).toLocaleString()}</button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer Section - Full Width */}
      <div style={{marginTop:40}}>
        <h4>Trailer</h4>
        <div style={{aspectRatio:'16/9',marginTop:12}}>
          <iframe width="100%" height="360" src={movie.trailer} title="trailer" frameBorder="0" allowFullScreen />
        </div>
      </div>
    </div>
  )
}
