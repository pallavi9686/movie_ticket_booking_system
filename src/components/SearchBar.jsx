import React from 'react'

export default function SearchBar({ filters, setFilters }) {
  return (
    <div className="search-bar enhanced">
      <label className="search-input-wrap">
        <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input
          className="search-input"
          placeholder="Search title"
          value={filters.title}
          onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
        />
      </label>

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
        className="button clear-btn"
        onClick={() => setFilters({ title: '', genre: '', date: '' })}
        aria-label="Clear filters"
      >
        Clear
      </button>
    </div>
  )
}
