'use client'

import { Search } from 'lucide-react'
import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { MenuContext } from '@/contexts/LogoProvider'

interface SearchDropdownProps {
  onSearch?: () => void;
}

export default function SearchDropdown({ onSearch }: SearchDropdownProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const { updateMenuState } = useContext(MenuContext)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Если строка пустая или содержит только пробелы, очищаем поисковый запрос
    if (!searchQuery.trim()) {
      return
    }

    // Иначе выполняем поиск и переходим на страницу поиска
    router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`)
    
    // Закрываем выпадающее меню после поиска
    if (onSearch) {
      onSearch();
    } else {
      updateMenuState?.({ isMenuOpen: false });
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl uppercase font-medium">Поиск</h3>
        <span className="text-primary">
          <Search size="24" />
        </span>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Найти в блоге..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pr-4 pl-3 border-b border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        
        <button 
          type="submit" 
          className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground uppercase text-sm font-medium px-4 py-2 rounded-md transition-colors"
          aria-label="Найти"
        >
          Найти
        </button>
      </form>
    </div>
  )
} 