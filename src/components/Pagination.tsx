// src/components/Pagination.tsx
'use client'

import { Link } from 'next-view-transitions'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
}: PaginationProps) {
  // Убираем неиспользуемую переменную pathname
  // const pathname = usePathname();

  // Если всего одна страница, не показываем пагинацию
  if (totalPages <= 1) {
    return null
  }

  // Определяем, какие номера страниц показывать
  const getPageNumbers = () => {
    const pages = []

    // Всегда показываем первую страницу
    pages.push(1)

    // Добавляем текущую страницу и страницы вокруг нее
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Всегда показываем последнюю страницу
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    // Сортируем и возвращаем уникальные номера страниц
    return [...new Set(pages)].sort((a, b) => a - b)
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex justify-center items-center space-x-1 mt-6">
      {/* Кнопка "Предыдущая страница" */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}${
            currentPage === 2 ? '' : `?page=${currentPage - 1}`
          }`}
          className="px-3 py-1 rounded border hover:bg-gray-100 transition-colors">
          &larr; Назад
        </Link>
      ) : (
        <span className="px-3 py-1 rounded border opacity-50 cursor-not-allowed">
          &larr; Назад
        </span>
      )}

      {/* Номера страниц */}
      <div className="flex items-center">
        {pageNumbers.map((pageNumber, index) => {
          // Добавляем многоточие, если есть пропуски в номерах страниц
          if (index > 0 && pageNumber > pageNumbers[index - 1] + 1) {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1 mx-1">
                ...
              </span>
            )
          }

          return (
            <Link
              key={pageNumber}
              href={`${basePath}${
                pageNumber === 1 ? '' : `?page=${pageNumber}`
              }`}
              className={`px-3 py-1 mx-1 rounded ${
                currentPage === pageNumber
                  ? 'bg-blue-600 text-white'
                  : 'border hover:bg-gray-100'
              }`}>
              {pageNumber}
            </Link>
          )
        })}
      </div>

      {/* Кнопка "Следующая страница" */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-3 py-1 rounded border hover:bg-gray-100 transition-colors">
          Вперёд &rarr;
        </Link>
      ) : (
        <span className="px-3 py-1 rounded border opacity-50 cursor-not-allowed">
          Вперёд &rarr;
        </span>
      )}
    </div>
  )
}
