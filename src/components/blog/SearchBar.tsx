'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'

// Создаем клиентский компонент, который использует useSearchParams
function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  // Инициализируем поле поиска текущим запросом из URL
  useEffect(() => {
    const currentQuery = searchParams.get('q') || ''
    setSearchQuery(currentQuery)
  }, [searchParams])

  // Функция обработки отправки формы
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Если строка пустая или содержит только пробелы, очищаем поисковый запрос
    if (!searchQuery.trim()) {
      router.push('/blog/search')
      return
    }

    // Иначе выполняем поиск
    router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-2">
      <div className="flex-grow relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Поиск по блогу..."
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Поисковый запрос"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
        Найти
      </button>
    </form>
  )
}

// Экспортируем компонент-обертку с Suspense
export default function SearchBar() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-2 items-center">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <div className="w-full pl-10 pr-4 py-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 animate-pulse">
              Загрузка...
            </div>
          </div>
          <div className="px-5 py-3 bg-gray-300 rounded-lg whitespace-nowrap">Найти</div>
        </div>
      }>
      <SearchForm />
    </Suspense>
  )
} 