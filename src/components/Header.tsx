// src/components/Header.tsx или подобный компонент навигации
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-xl">
          Мой блог
        </Link>

        <nav>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600 transition-colors">
                Главная
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                className="hover:text-blue-600 transition-colors">
                Блог
              </Link>
            </li>
            <li>
              <Link
                href="/blog/tags"
                className="hover:text-blue-600 transition-colors">
                Теги
              </Link>
            </li>
            <li>
              <Link
                href="/blog/search"
                className="hover:text-blue-600 transition-colors">
                Поиск
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
