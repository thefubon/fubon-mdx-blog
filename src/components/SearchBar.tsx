// src/components/SearchBar.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
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
      router.push('/search')
      return
    }

    // Иначе выполняем поиск
    router.push(`/blog/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-2 mb-6">
      <input
        type="text"
        placeholder="Поиск по блогу..."
        className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Поисковый запрос"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
        Найти
      </button>
    </form>
  )
}
