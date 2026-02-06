import React, { useEffect, useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import { Link } from 'react-router-dom'

export default function Home(){
  const [movies, setMovies] = useState([])
  const [filters, setFilters] = useState({title:'',genre:'',date:''})

  useEffect(()=>{
    fetch('/src/data/movies.json').then(r=>r.json()).then(setMovies).catch(()=>setMovies([]))
  },[])

  const filtered = useMemo(()=>{
    return movies.filter(m=>{
      if(filters.title && !m.title.toLowerCase().includes(filters.title.toLowerCase())) return false
      if(filters.genre && !m.genre.toLowerCase().includes(filters.genre.toLowerCase())) return false
      if(filters.date){
        // filter by date if any showtime on that date
        const has = m.showtimes.some(s=> s.startsWith(filters.date))
        if(!has) return false
      }
      return true
    })
  },[movies,filters])

  return (
    <div className="container">
      <div className="hero">
        <div>
          <h1 className="title">Find your next movie night</h1>
          <p className="subtitle">Browse showtimes, pick seats and book instantly — great films, great seats.</p>
          <div className="cta">
            {movies && movies[0] ? (
              <Link to={`/movie/${movies[0].id}`}>
                <button className="button">Browse Featured</button>
              </Link>
            ) : (
              <button className="button">Browse Movies</button>
            )}
            <span className="badge">Free cancellations</span>
          </div>
        </div>
        <div style={{minWidth:280}}>
          <SearchBar filters={filters} setFilters={setFilters} />
        </div>
      </div>

      <h2>Now showing</h2>
      <div className="grid movies-grid">
        {filtered.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  )
}
