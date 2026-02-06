import React, { useEffect, useMemo, useState } from 'react'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'

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
      <h2>Now showing</h2>
      <SearchBar filters={filters} setFilters={setFilters} />
      <div className="grid movies-grid">
        {filtered.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </div>
  )
}
