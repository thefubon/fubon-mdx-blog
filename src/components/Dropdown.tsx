'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/data/navbar'
import { ModeToggle } from './ModeToggle'

const Dropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const menuElement = useRef<HTMLDivElement>(null)
  const buttonElement = useRef<HTMLButtonElement>(null)
  const menuButton = 'Меню'
  const currentUrl = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen((prevValue) => {
      const newValue = !prevValue
      if (newValue) {
        document.body.classList.add('overflow')
      } else {
        document.body.classList.remove('overflow')
      }
      return newValue
    })
  }

  const checkIsMobile = () => {
    setIsMobile(window.innerWidth < 768) // Предполагаем, что мобильный вид - до 768px
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      menuElement.current &&
      buttonElement.current &&
      !menuElement.current.contains(event.target as Node) &&
      !buttonElement.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false)
      document.body.classList.remove('overflow')
    }
  }

  useEffect(() => {
    // Инициализация и добавление слушателей событий
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    window.addEventListener('click', handleClickOutside)

    return () => {
      // Очистка при размонтировании
      window.removeEventListener('resize', checkIsMobile)
      window.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <div className="dropdown">
      {isMenuOpen && isMobile && (
        <div
          className="dropdown--background"
          style={{
            animation: isMenuOpen
              ? 'fade-in 100ms ease'
              : 'fade-out 300ms ease 300ms',
          }}></div>
      )}

      <button
        ref={buttonElement}
        className={`group animation-trigger dropdown-button ${
          isMenuOpen ? 'open' : ''
        }`}
        aria-label="Кнопка открытия выпадающего меню"
        onClick={toggleMenu}>
        <div className="dropdown-button__text--container">
          <span
            className={`dropdown-button__text ${
              isMenuOpen ? '-translate-y-full' : ''
            }`}>
            {menuButton}
          </span>
          <span
            className={`dropdown-button__text open ${
              isMenuOpen ? '-translate-y-full' : ''
            }`}>
            {menuButton}
          </span>
        </div>

        <div className={`dropdown-button__dots ${isMenuOpen ? 'open' : ''}`}>
          <span className="dropdown-button__dots--item"></span>
          <span className="dropdown-button__dots--item"></span>
        </div>
      </button>

      <div
        ref={menuElement}
        className={`dropdown-menu ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        data-lenis-prevent>
        <ul
          className={`dropdown-list ${
            isMenuOpen ? 'dropdown-list--open' : 'dropdown-list--closed'
          }`}>
          {menuItems.map((item) =>
            currentUrl === item.link ? (
              <li
                key={item.link}
                className="dropdown-list__item active">
                <span>{item.name}</span>
                <span className="dropdown-list__item--dot"></span>
              </li>
            ) : (
              <li
                key={item.link}
                className="dropdown-list__item group">
                <Link
                  href={item.link}
                  aria-label={item.name}
                  onClick={toggleMenu}
                  className="absolute inset-0"
                />
                <div className="dropdown-list__text--container">
                  <span className="dropdown-list__text">{item.name}</span>
                  <span className="dropdown-list__text open">{item.name}</span>
                </div>

                <span className="dropdown-list__item-arrow--icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 16 16"
                    className="w-6 h-6">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M2.343 8h11.314m0 0-4.984 4.984M13.657 8 8.673 3.016"></path>
                  </svg>
                </span>
              </li>
            )
          )}
        </ul>

        <div
          className={`dropdown-section-2 ${
            isMenuOpen
              ? 'dropdown-section-2--open'
              : 'dropdown-section-2--closed'
          }`}>
          <ModeToggle />
        </div>

        <div
          className={`dropdown-section-3 ${
            isMenuOpen
              ? 'dropdown-section-3--open'
              : 'dropdown-section-3--closed'
          }`}>
          <span>Labs</span>
          <span>Icon</span>
        </div>
      </div>
    </div>
  )
}

export default Dropdown
