import React from 'react'

export default function SearchBar({ filters, setFilters }) {
  return (
    <div className="search-bar">
      <input
        className="search-input"
        placeholder="Search title"
        value={filters.title}
        onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
      />

      <input
        className="genre-input"
        placeholder="Genre"
        value={filters.genre}
        onChange={e => setFilters(f => ({ ...f, genre: e.target.value }))}
      />

      <input
        className="date-input"
        type="date"
        value={filters.date}
        onChange={e => setFilters(f => ({ ...f, date: e.target.value }))}
      />

      <button
        className="button"
        onClick={() => setFilters({ title: '', genre: '', date: '' })}
        aria-label="Clear filters"
      >
        Clear
      </button>
    </div>
  )
}
