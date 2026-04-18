/**
 * Sorts an array of Marvel movies based on the specified mode
 * 
 * @param {Array} movies - Array of movie objects
 * @param {string} mode - Sort mode: 'release_date', 'chronological', or 'unwatched'
 * @param {Array} chronologicalOrder - Optional array of movie IDs in chronological order (for 'chronological' mode)
 * @returns {Array} - Sorted array of movies
 */
export function sortMovies(movies, mode, chronologicalOrder = null) {
  // Create a copy to avoid mutating the original array
  const sortedMovies = [...movies]

  switch (mode) {
    case 'release_date':
      // Sort by release date (oldest to newest)
      return sortedMovies.sort((a, b) => {
        const dateA = new Date(a.release_date)
        const dateB = new Date(b.release_date)
        return dateA - dateB
      })

    case 'chronological': {
      // Sort by custom chronological order provided by user
      if (!chronologicalOrder || chronologicalOrder.length === 0) {
        // Fallback to ID order if no custom order provided
        console.warn('No chronological order provided, falling back to ID order')
        return sortedMovies.sort((a, b) => a.id - b.id)
      }

      // Create a map for quick lookup of position in chronological order
      const orderMap = new Map()
      chronologicalOrder.forEach((id, index) => {
        orderMap.set(id, index)
      })

      return sortedMovies.sort((a, b) => {
        const orderA = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity
        const orderB = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity
        
        // Movies in the order list come first, then by ID
        if (orderA !== orderB) {
          return orderA - orderB
        }
        return a.id - b.id
      })
    }

    case 'unwatched':
      // Sort by watched status: unwatched (false) first, then watched (true)
      // Within each group, maintain release date order
      return sortedMovies.sort((a, b) => {
        // If watched status differs, unwatched comes first
        if (a.watched !== b.watched) {
          return a.watched ? 1 : -1
        }
        // If same watched status, sort by release date
        const dateA = new Date(a.release_date)
        const dateB = new Date(b.release_date)
        return dateA - dateB
      })

    default:
      // Return unsorted if mode is not recognized
      console.warn(`Unknown sort mode: ${mode}`)
      return sortedMovies
  }
}
