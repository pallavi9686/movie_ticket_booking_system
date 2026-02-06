import React, { useEffect, useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import { Link } from 'react-router-dom'

export default function Home(){
  const [movies, setMovies] = useState([])
  const [filters, setFilters] = useState({title:'',genre:'',date:''})
  const [sortBy, setSortBy] = useState('latest')

  useEffect(()=>{
    fetch('/src/data/movies.json').then(r=>r.json()).then(setMovies).catch(()=>setMovies([]))
  },[])

  const filtered = useMemo(()=>{
    let result = movies.filter(m=>{
      if(filters.title && !m.title.toLowerCase().includes(filters.title.toLowerCase())) return false
      if(filters.genre && !m.genre.toLowerCase().includes(filters.genre.toLowerCase())) return false
      if(filters.date){
        const has = m.showtimes.some(s=> s.startsWith(filters.date))
        if(!has) return false
      }
      return true
    })

    if(sortBy==='rating') result.sort((a,b)=> parseFloat(b.rating) - parseFloat(a.rating))
    else if(sortBy==='title') result.sort((a,b)=> a.title.localeCompare(b.title))
    else if(sortBy==='duration') result.sort((a,b)=> parseInt(b.duration) - parseInt(a.duration))

    return result
  },[movies,filters,sortBy])

  const topRated = useMemo(()=> [...movies].sort((a,b)=> parseFloat(b.rating) - parseFloat(a.rating)).slice(0,3), [movies])

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

      {topRated.length > 0 && (
        <div className="featured-section">
          <h2 className="section-title">⭐ Top Rated</h2>
          <div className="featured-carousel">
            {topRated.map(m => (
              <Link key={m.id} to={`/movie/${m.id}`} style={{textDecoration:'none'}}>
                <div className="featured-card">
                  <div className="featured-bg" style={{backgroundImage:`url(${m.poster})`}}/>
                  <div className="featured-overlay"/>
                  <div className="featured-content">
                    <div className="featured-title">{m.title}</div>
                    <div className="featured-meta">{m.genre} • {m.duration} • ⭐ {m.rating}</div>
                    <div className="featured-cta">
                      <button className="button" style={{fontSize:'13px',padding:'8px 12px'}}>View Details</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="section-stats">
        <div className="stat-card">
          <div className="stat-value">{movies.length}</div>
          <div className="stat-label">Movies Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{filtered.length}</div>
          <div className="stat-label">Matching Your Search</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">$8</div>
          <div className="stat-label">Price per Seat</div>
        </div>
      </div>

      <div className="filters-bar">
        <select className="sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="latest">Sort by: Latest</option>
          <option value="rating">Sort by: Highest Rated</option>
          <option value="title">Sort by: Title (A-Z)</option>
          <option value="duration">Sort by: Duration</option>
        </select>
      </div>

      <div className="section-header">
        <h2 className="section-title">Now showing</h2>
        <span className="badge">{filtered.length} results</span>
      </div>

      {filtered.length > 0 ? (
        <div className="grid movies-grid">
          {filtered.map(m => <MovieCard key={m.id} movie={m} />)}
        </div>
      ) : (
        <div className="no-results">
          <h3>No movies found</h3>
          <p>Try adjusting your search filters or clear them to see all movies.</p>
        </div>
      )}
    </div>
  )
}
