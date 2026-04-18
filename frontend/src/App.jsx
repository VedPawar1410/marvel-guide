import { useState, useEffect, useCallback } from 'react'
import { Filter, Calendar, Clock, Eye, Search } from 'lucide-react'
import MovieCard from './components/MovieCard'
import { sortMovies } from './utils/sortMovies'
import './App.css'

// Eras to exclude from the filter UI (legacy/non-MCU eras)
const HIDDEN_ERAS = [
  'The Early Years (Pre-2000s)',
  'The Licensed Era (2000\u20132008)',
  'The Infinity Saga (2008\u20132019)',
]

/**
 * Main App Component - Marvel Movie Guide Dashboard
 * Features:
 * - Dark cinematic theme with glassmorphism
 * - Filter by Release Date, Chronological, and Era
 * - Search functionality
 * - Watched status tracking
 */
function App() {
  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('release_date') // 'release_date', 'chronological', 'unwatched'
  const [selectedEra, setSelectedEra] = useState('all')
  const [loading, setLoading] = useState(true)
  // Chronological order: array of movie IDs in the order you want them displayed
  // Example: [1, 3, 5, 2, 4] means movie with id 1 comes first, then 3, then 5, etc.
  // To set your custom order, update this array with the movie IDs in your desired sequence
  // Example: const [chronologicalOrder, setChronologicalOrder] = useState([1, 3, 5, 2, 4, 6, ...])
  const [chronologicalOrder] = useState([])

  const fetchMovies = useCallback(async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/movies`)
      const data = await response.json()
      setMovies(data.movies)
      setFilteredMovies(data.movies)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching movies:', error)
      setLoading(false)
    }
  }, [apiBaseUrl])

  // Fetch movies from API
  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  // Get unique eras for filter (excluding the hidden legacy eras)
  const eras = ['all', ...new Set(
    movies
      .filter(movie => !HIDDEN_ERAS.includes(movie.era))
      .map(movie => movie.era)
  )]

  // Filter and sort movies
  useEffect(() => {
    let filtered = [...movies]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.era.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Era filter
    if (selectedEra !== 'all') {
      filtered = filtered.filter(movie => movie.era === selectedEra)
    }

    // Sort using the sortMovies utility function
    const sorted = sortMovies(filtered, sortBy, chronologicalOrder)
    setFilteredMovies(sorted)
  }, [movies, searchQuery, sortBy, selectedEra, chronologicalOrder])

  // Toggle watched status
  const handleToggleWatched = async (movieId, watched) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/movies/${movieId}/watched`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watched }),
      })

      if (response.ok) {
        // Update local state
        setMovies(prevMovies =>
          prevMovies.map(movie =>
            movie.id === movieId ? { ...movie, watched } : movie
          )
        )
      }
    } catch (error) {
      console.error('Error updating watched status:', error)
    }
  }

  // Get overall stats
  const totalMovies = movies.length
  const watchedCount = movies.filter(m => m.watched).length
  const progress = totalMovies > 0 ? Math.round((watchedCount / totalMovies) * 100) : 0

  // Per-type stats
  const TYPE_LABELS = { Movie: 'Movies', Series: 'Series', Special: 'Specials' }
  const typeStats = ['Movie', 'Series', 'Special'].map(type => {
    const all = movies.filter(m => m.type === type)
    const watched = all.filter(m => m.watched).length
    const pct = all.length > 0 ? Math.round((watched / all.length) * 100) : 0
    return { type, label: TYPE_LABELS[type], total: all.length, watched, pct }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading Marvel movies...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Marvel Movie Guide
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Your complete guide to the Marvel Cinematic Universe
              </p>
            </div>
            
            {/* Stats */}
            <div className="flex gap-2 flex-wrap">
              {/* Overall */}
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
                <div className="text-xs text-gray-400 mb-0.5">Overall</div>
                <div className="text-lg font-bold text-white">{progress}%</div>
                <div className="text-xs text-gray-500">{watchedCount} / {totalMovies}</div>
              </div>
              {/* Per-type stats */}
              {typeStats.map(({ type, label, total, watched, pct }) => (
                <div key={type} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-center">
                  <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                  <div className="text-lg font-bold text-white">{pct}%</div>
                  <div className="text-xs text-gray-500">{watched} / {total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Filters Bar */}
      <div className="relative md:sticky md:top-[88px] z-40 backdrop-blur-xl bg-slate-900/60 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search movies, shows, or eras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg 
                         backdrop-blur-md bg-white/5 border border-white/10 
                         text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSortBy('release_date')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                         backdrop-blur-md border transition-all
                         ${sortBy === 'release_date'
                  ? 'bg-red-600/20 border-red-600/50 text-red-400'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Release Date</span>
              </button>

              <button
                onClick={() => setSortBy('chronological')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                         backdrop-blur-md border transition-all
                         ${sortBy === 'chronological'
                  ? 'bg-red-600/20 border-red-600/50 text-red-400'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">Chronological</span>
              </button>

              <button
                onClick={() => setSortBy('unwatched')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                         backdrop-blur-md border transition-all
                         ${sortBy === 'unwatched'
                  ? 'bg-red-600/20 border-red-600/50 text-red-400'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Unwatched First</span>
              </button>
            </div>
          </div>

          {/* Era Filter */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Filter by Era:</span>
            {eras.map((era) => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-3 py-1 rounded-md text-sm transition-all
                         ${selectedEra === era
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {era === 'all' ? 'All Eras' : era}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4 text-gray-400 text-sm">
          Showing {filteredMovies.length} of {totalMovies} movies
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onToggleWatched={handleToggleWatched}
            />
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No movies found matching your filters.</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
