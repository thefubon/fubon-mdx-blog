'use client'

interface FavoriteToggleProps {
  showFavorites: boolean
  onToggle: (showFavorites: boolean) => void
}

export default function FavoriteToggle({ showFavorites, onToggle }: FavoriteToggleProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 inline-flex">
      <button
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          !showFavorites
            ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
        onClick={() => onToggle(false)}
      >
        Все
      </button>
      <button
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          showFavorites
            ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`}
        onClick={() => onToggle(true)}
      >
        Избранное
      </button>
    </div>
  )
} 