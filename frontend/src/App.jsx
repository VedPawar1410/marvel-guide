import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import MovieCard from './components/MovieCard'
import TweaksPanel from './components/TweaksPanel'
import './App.css'

const HIDDEN_ERAS = [
  'The Early Years (Pre-2000s)',
  'The Licensed Era (2000–2008)',
  'The Infinity Saga (2008–2019)',
]

const TYPE_CONFIG = {
  Movie:   { color: '#E23636', label: 'MOVIE' },
  Series:  { color: '#1E6FD9', label: 'SERIES' },
  Special: { color: '#8B22E5', label: 'SPECIAL' },
}

function sortMovies(arr, mode) {
  const a = [...arr]
  if (mode === 'release_date') return a.sort((x, y) => new Date(x.release_date) - new Date(y.release_date))
  if (mode === 'chronological') return a.sort((x, y) => x.id - y.id)
  if (mode === 'unwatched') return a.sort((x, y) => {
    if (x.watched !== y.watched) return x.watched ? 1 : -1
    return new Date(x.release_date) - new Date(y.release_date)
  })
  return a
}

function StatCard({ label, pct, watched, total }) {
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__pct">{pct}<span>%</span></div>
      <div className="stat__frac">{watched}/{total}</div>
    </div>
  )
}

function App() {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
  const [movies, setMovies]           = useState([])
  const [search, setSearch]           = useState('')
  const [sortBy, setSortBy]           = useState('release_date')
  const [era, setEra]                 = useState('all')
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [tweaksOpen, setTweaksOpen]   = useState(false)
  const [tweaks, setTweaksState]      = useState({ accentColor: '#E23636', typeFilter: 'all' })
  const headerRef = useRef(null)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('marvel-guide-watched') || '{}')
    fetch(`${apiBaseUrl}/api/movies`)
      .then(r => { if (!r.ok) throw new Error('fetch failed'); return r.json() })
      .then(data => {
        const movies = data.movies || data
        setMovies(movies.map(m => ({ ...m, watched: saved[m.id] ?? (m.watched || false) })))
        setTimeout(() => setLoading(false), 700)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [apiBaseUrl])

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accentColor)
  }, [tweaks.accentColor])

  useEffect(() => {
    if (!headerRef.current) return
    const ro = new ResizeObserver(() => {
      const h = headerRef.current?.offsetHeight ?? 88
      document.documentElement.style.setProperty('--hdr-h', h + 'px')
    })
    ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [loading])

  const setTweak = useCallback((key, val) => {
    setTweaksState(prev => ({ ...prev, [key]: val }))
  }, [])

  const eras = useMemo(() => [
    'all',
    ...new Set(movies.filter(m => !HIDDEN_ERAS.includes(m.era)).map(m => m.era))
  ], [movies])

  const filtered = useMemo(() => {
    let f = [...movies]
    if (search) {
      const q = search.toLowerCase()
      f = f.filter(m => m.title.toLowerCase().includes(q) || m.era.toLowerCase().includes(q))
    }
    if (era !== 'all') f = f.filter(m => m.era === era)
    if (tweaks.typeFilter !== 'all') f = f.filter(m => m.type === tweaks.typeFilter)
    return sortMovies(f, sortBy)
  }, [movies, search, sortBy, era, tweaks.typeFilter])

  const handleToggle = useCallback((id, watched) => {
    setMovies(prev => {
      const next = prev.map(m => m.id === id ? { ...m, watched } : m)
      const saved = {}
      next.filter(m => m.watched).forEach(m => { saved[m.id] = true })
      localStorage.setItem('marvel-guide-watched', JSON.stringify(saved))
      return next
    })
    fetch(`${apiBaseUrl}/api/movies/${id}/watched`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ watched }),
    }).catch(() => {})
  }, [apiBaseUrl])

  const total        = movies.length
  const watchedCount = movies.filter(m => m.watched).length
  const pct          = total > 0 ? Math.round(watchedCount / total * 100) : 0

  const typeStats = ['Movie', 'Series', 'Special'].map(type => {
    const all = movies.filter(m => m.type === type)
    const w   = all.filter(m => m.watched).length
    return { type, label: type + 's', total: all.length, watched: w, pct: all.length ? Math.round(w / all.length * 100) : 0 }
  })

  if (loading) return (
    <div className="splash">
      <div className="splash__logo">MARVEL</div>
      <div className="splash__sub">GUIDE</div>
      <div className="splash__bar"><div className="splash__fill" /></div>
      <p className="splash__txt">Assembling the Universe&hellip;</p>
    </div>
  )

  if (error) return (
    <div className="splash">
      <div className="splash__logo" style={{ background: '#555' }}>ERROR</div>
      <p className="splash__txt" style={{ color: '#888' }}>Could not load movie data.</p>
    </div>
  )

  return (
    <>
      <header className="hdr" ref={headerRef}>
        <div className="hdr__inner">
          <div className="hdr__brand">
            <div className="hdr__mbox">MARVEL</div>
            <div className="hdr__titles">
              <h1 className="hdr__title">GUIDE</h1>
              <p className="hdr__sub">Your Complete MCU Watchlist</p>
            </div>
          </div>
          <div className="hdr__stats">
            <StatCard label="Overall" pct={pct} watched={watchedCount} total={total} />
            {typeStats.map(s => (
              <StatCard key={s.type} label={s.label} pct={s.pct} watched={s.watched} total={s.total} />
            ))}
          </div>
        </div>
        <div className="hdr__bar">
          <div className="hdr__bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </header>

      <div className="fbar">
        <div className="fbar__inner">
          <div className="fbar__row">
            <div className="fsearch">
              <span className="fsearch__ico">&#9906;</span>
              <input
                className="fsearch__inp"
                type="text"
                placeholder="Search titles or eras&hellip;"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="fsearch__clr" onClick={() => setSearch('')}>&#215;</button>
              )}
            </div>
            <div className="fsort">
              {[
                ['release_date',  'Release Date'],
                ['chronological', 'Chronological'],
                ['unwatched',     'Unwatched First'],
              ].map(([id, lbl]) => (
                <button
                  key={id}
                  className={`fsort__btn${sortBy === id ? ' fsort__btn--on' : ''}`}
                  onClick={() => setSortBy(id)}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div className="fera">
            {eras.map(e => (
              <button
                key={e}
                className={`fera__pill${era === e ? ' fera__pill--on' : ''}`}
                onClick={() => setEra(e)}
              >
                {e === 'all' ? 'All Eras' : e}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="content">
        <p className="content__count">
          Showing <strong>{filtered.length}</strong> of {total} titles
        </p>
        <div className="grid">
          {filtered.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatched={handleToggle}
              index={i}
              typeConfig={TYPE_CONFIG}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="empty">
            <div className="empty__q">?</div>
            <p>No titles match your filters.</p>
          </div>
        )}
      </main>

      {tweaksOpen ? (
        <TweaksPanel tweaks={tweaks} setTweak={setTweak} onClose={() => setTweaksOpen(false)} />
      ) : (
        <button className="twp-open" onClick={() => setTweaksOpen(true)}>
          TWEAKS
        </button>
      )}
    </>
  )
}

export default App
