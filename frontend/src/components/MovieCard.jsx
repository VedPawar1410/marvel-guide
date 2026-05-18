import { useState } from 'react'

const TYPE_CONFIG = {
  Movie:   { color: '#E23636', label: 'MOVIE' },
  Series:  { color: '#1E6FD9', label: 'SERIES' },
  Special: { color: '#8B22E5', label: 'SPECIAL' },
}

function fmtDate(ds) {
  if (!ds) return 'TBA'
  try {
    return new Date(ds).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch { return ds }
}

function MovieCard({ movie, onToggleWatched, index }) {
  const [stamping, setStamping] = useState(false)
  const tc = TYPE_CONFIG[movie.type] || { color: '#555', label: String(movie.type).toUpperCase() }

  const handleChange = (e) => {
    const checked = e.target.checked
    if (checked) { setStamping(true); setTimeout(() => setStamping(false), 900) }
    onToggleWatched(movie.id, checked)
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : ''
  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(`${movie.title}${year ? ` ${year}` : ''}`)}`

  return (
    <article
      className={`mc${movie.watched ? ' mc--watched' : ''}`}
      style={{ '--delay': `${Math.min(index, 22) * 40}ms`, '--tc': tc.color }}
    >
      <div className="mc__accent" />

      <header className="mc__head">
        <span className="mc__badge">{tc.label}</span>
        {movie.watched && <span className="mc__tick">&#10003;</span>}
      </header>

      <h3 className="mc__title">{movie.title}</h3>
      <p className="mc__date">{fmtDate(movie.release_date)}</p>
      <p className="mc__era" title={movie.era}>{movie.era}</p>

      {movie.watched && (
        <div className={`mc__stamp${stamping ? ' mc__stamp--anim' : ''}`}>WATCHED</div>
      )}

      <footer className="mc__foot">
        <label className="mc__wlabel">
          <input
            type="checkbox"
            className="mc__cb"
            checked={!!movie.watched}
            onChange={handleChange}
          />
          <span>{movie.watched ? 'Watched' : 'Mark Watched'}</span>
        </label>
        <a className="mc__lookup" href={googleUrl} target="_blank" rel="noopener noreferrer">
          Look Up &#8599;
        </a>
      </footer>
    </article>
  )
}

export default MovieCard
