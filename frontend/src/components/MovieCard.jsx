import { Check } from 'lucide-react'

/**
 * MovieCard Component
 * Displays a single Marvel movie/show card with title, type, release date, and watched checkbox
 * Uses glassmorphism effect for a modern, cinematic look
 */
function MovieCard({ movie, onToggleWatched }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Movie':
        return 'bg-red-600/20 text-red-400 border-red-600/30'
      case 'Series':
        return 'bg-blue-600/20 text-blue-400 border-blue-600/30'
      case 'Special':
        return 'bg-purple-600/20 text-purple-400 border-purple-600/30'
      default:
        return 'bg-gray-600/20 text-gray-400 border-gray-600/30'
    }
  }

  return (
    <div 
      className={`
        relative group
        backdrop-blur-md bg-white/5 
        border border-white/10 
        rounded-xl p-4
        hover:bg-white/10 
        hover:border-red-600/50
        transition-all duration-300
        ${movie.watched ? 'opacity-75' : 'opacity-100'}
      `}
    >
      {/* Watched overlay indicator */}
      {movie.watched && (
        <div className="absolute top-2 right-2">
          <div className="bg-red-600/80 rounded-full p-1">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-2 pr-8 line-clamp-2">
        {movie.title}
      </h3>

      {/* Type badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${getTypeColor(movie.type)}`}>
          {movie.type}
        </span>
        <span className="text-xs text-gray-400">
          {formatDate(movie.release_date)}
        </span>
      </div>

      {/* Era */}
      <p className="text-xs text-gray-500 mb-3 line-clamp-1">
        {movie.era}
      </p>

      {/* Watched checkbox */}
      <label className="flex items-center gap-2 cursor-pointer group/checkbox">
        <input
          type="checkbox"
          checked={movie.watched || false}
          onChange={(e) => onToggleWatched(movie.id, e.target.checked)}
          className="w-4 h-4 rounded border-gray-600 bg-white/5 text-red-600 
                     focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-slate-900
                     cursor-pointer"
        />
        <span className="text-sm text-gray-300 group-hover/checkbox:text-white transition-colors">
          Watched
        </span>
      </label>
    </div>
  )
}

export default MovieCard
