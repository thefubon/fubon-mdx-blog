'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/data/navbar'
import { DarkMode } from './DarkMode'
import { MailPlus } from 'lucide-react'

const ButtonDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  // Состояние для контроля видимости фона
  const [showBackground, setShowBackground] = useState(false)
  // Состояние для контроля анимации
  const [isFading, setIsFading] = useState(false)

  // Правильная типизация для рефов таймеров
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)

  const menuElement = useRef<HTMLDivElement>(null)
  const buttonElement = useRef<HTMLButtonElement>(null)
  const menuButton = 'Меню'
  const currentUrl = usePathname()

  // Раздельные константы для всех аспектов анимации
  const FADE_IN_DURATION = 300 // мс - продолжительность анимации появления
  const FADE_OUT_DURATION = 300 // мс - продолжительность анимации исчезновения
  const VISIBLE_DURATION = 500 // мс - как долго фон остается видимым до начала анимации исчезновения
  const HIDE_DELAY = 500 // мс - общая задержка удаления элемента

  // Функция для очистки всех активных таймеров, обернутая в useCallback
  const clearAllTimers = useCallback(() => {
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current)
      fadeTimerRef.current = null
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  // Функция для запуска анимации исчезновения с задержкой, обернутая в useCallback
  const startFadeOutSequence = useCallback(
    (useHideDelay = false) => {
      clearAllTimers() // Сначала очищаем любые активные таймеры

      // Выбор между VISIBLE_DURATION и HIDE_DELAY, чтобы использовать обе константы
      const delayToUse = useHideDelay ? HIDE_DELAY : VISIBLE_DURATION

      // Запускаем анимацию исчезновения после выбранной задержки
      fadeTimerRef.current = setTimeout(() => {
        setIsFading(true)

        // Удаляем элемент после завершения анимации исчезновения
        hideTimerRef.current = setTimeout(() => {
          setShowBackground(false)
        }, FADE_OUT_DURATION)
      }, delayToUse)
    },
    [HIDE_DELAY, VISIBLE_DURATION, FADE_OUT_DURATION, clearAllTimers]
  )

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prevValue) => {
      const newValue = !prevValue

      if (newValue) {
        // При открытии меню
        document.body.classList.add('overflow')
        clearAllTimers() // Очищаем все таймеры
        setShowBackground(true) // Сразу показываем фон
        setIsFading(false) // Сбрасываем статус анимации
      } else {
        // При закрытии меню
        document.body.classList.remove('overflow')
        startFadeOutSequence() // Используем VISIBLE_DURATION
      }

      return newValue
    })
  }, [clearAllTimers, startFadeOutSequence])

  // Эффект для очистки таймеров при размонтировании
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [clearAllTimers])

  // Эффект для синхронизации состояния фона с состоянием меню
  useEffect(() => {
    if (isMenuOpen) {
      // При открытии меню
      clearAllTimers()
      setShowBackground(true)
      setIsFading(false)
    }
  }, [isMenuOpen, clearAllTimers])

  // Демонстрация использования HIDE_DELAY для случаев закрытия вне нормального потока
  useEffect(() => {
    // Пример: если меню было закрыто каким-то внешним событием
    if (!isMenuOpen && showBackground && !isFading && !fadeTimerRef.current) {
      // Используем HIDE_DELAY в этом особом случае
      startFadeOutSequence(true) // передаем true для использования HIDE_DELAY
    }
  }, [isMenuOpen, showBackground, isFading, startFadeOutSequence])

  const checkIsMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768) // Предполагаем, что мобильный вид - до 768px
  }, [])

  // Обработчик клика вне меню, обернутый в useCallback
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuElement.current &&
        buttonElement.current &&
        !menuElement.current.contains(event.target as Node) &&
        !buttonElement.current.contains(event.target as Node) &&
        isMenuOpen // Проверяем, что меню открыто
      ) {
        setIsMenuOpen(false)
        document.body.classList.remove('overflow')

        // Используем альтернативную задержку (HIDE_DELAY) для кликов вне меню
        startFadeOutSequence(true) // true = используем HIDE_DELAY вместо VISIBLE_DURATION
      }
    },
    [isMenuOpen, startFadeOutSequence]
  )

  // Устанавливаем и удаляем слушателей событий
  useEffect(() => {
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    window.addEventListener('click', handleClickOutside)

    return () => {
      window.removeEventListener('resize', checkIsMobile)
      window.removeEventListener('click', handleClickOutside)
      clearAllTimers() // Очищаем все таймеры при размонтировании
    }
  }, [checkIsMobile, handleClickOutside, clearAllTimers]) // Добавляем все зависимости

  return (
    <div className="header__dropdown">
      {/* showBackground && isMobile && */}
      {showBackground && (
        <div
          className="dropdown--background"
          style={{
            animation: isFading
              ? `fade-out ${FADE_OUT_DURATION}ms ease`
              : `fade-in ${FADE_IN_DURATION}ms ease`,
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
          <DarkMode />
        </div>

        <div
          className={`dropdown-section-3 ${
            isMenuOpen
              ? 'dropdown-section-3--open'
              : 'dropdown-section-3--closed'
          }`}>
          <span>
            <MailPlus size="32" />
          </span>
          <span>Email</span>
        </div>
      </div>
    </div>
  )
}

export default ButtonDropdown

