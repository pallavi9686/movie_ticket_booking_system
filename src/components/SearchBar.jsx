import React from 'react'

export default function SearchBar({ filters, setFilters }) {
  return (
    <div style={{display:'flex',gap:8,marginBottom:12}}>
      <input placeholder="Search title" value={filters.title} onChange={e=>setFilters(f=>({...f,title:e.target.value}))} />
      <input placeholder="Genre" value={filters.genre} onChange={e=>setFilters(f=>({...f,genre:e.target.value}))} />
      <input type="date" value={filters.date} onChange={e=>setFilters(f=>({...f,date:e.target.value}))} />
    </div>
  )
}
