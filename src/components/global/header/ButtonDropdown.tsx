'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  memo,
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/data/navbar'
import { DarkMode } from './DarkMode'
import { MailPlus } from 'lucide-react'
import SoundWrapper from '@/components/SoundWrapper'
import { MenuContext } from '@/contexts/LogoProvider'

const ButtonDropdownComponent = () => {
  const { updateMenuState } = useContext(MenuContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showBackground, setShowBackground] = useState(false)
  const [isFading, setIsFading] = useState(false)

  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const menuElement = useRef<HTMLDivElement>(null)
  const buttonElement = useRef<HTMLButtonElement>(null)
  const menuButton = 'Меню'
  const currentUrl = usePathname()

  const FADE_IN_DURATION = 300
  const FADE_OUT_DURATION = 300
  const VISIBLE_DURATION = 500
  const HIDE_DELAY = 500

  const checkIsMobile = useCallback(() => {
    return window.innerWidth < 768
  }, [])

  const toggleBodyScroll = useCallback((disable: boolean) => {
    document.body.style.overflow = disable ? 'hidden' : ''
    document.body.classList.toggle('overflow-hidden', disable)
  }, [])

  const clearAllTimers = useCallback(() => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    fadeTimerRef.current = null
    hideTimerRef.current = null
  }, [])

  const startFadeOutSequence = useCallback(
    (useHideDelay = false) => {
      clearAllTimers()
      const delay = useHideDelay ? HIDE_DELAY : VISIBLE_DURATION

      fadeTimerRef.current = setTimeout(() => {
        setIsFading(true)
        hideTimerRef.current = setTimeout(() => {
          setShowBackground(false)
        }, FADE_OUT_DURATION)
      }, delay)
    },
    [FADE_OUT_DURATION, HIDE_DELAY, VISIBLE_DURATION, clearAllTimers]
  )

  const toggleMenu = useCallback(() => {
    const newValue = !isMenuOpen
    setIsMenuOpen(newValue)

    if (newValue) {
      toggleBodyScroll(true)
      clearAllTimers()
      setShowBackground(true)
      setIsFading(false)
    } else {
      toggleBodyScroll(false)
      startFadeOutSequence()
    }
  }, [isMenuOpen, clearAllTimers, startFadeOutSequence, toggleBodyScroll])

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        menuElement.current &&
        buttonElement.current &&
        !menuElement.current.contains(event.target as Node) &&
        !buttonElement.current.contains(event.target as Node) &&
        isMenuOpen
      ) {
        toggleMenu()
      }
    },
    [isMenuOpen, toggleMenu]
  )

  // Инициализация и обработка ресайза
  useEffect(() => {
    const handleResize = () => {
      const mobileStatus = checkIsMobile()
      if (mobileStatus !== isMobile) {
        setIsMobile(mobileStatus)
      }
    }

    setIsMobile(checkIsMobile())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [checkIsMobile, isMobile])

  // Обработка кликов вне меню
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [handleClickOutside])

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      clearAllTimers()
      toggleBodyScroll(false)
    }
  }, [clearAllTimers, toggleBodyScroll])

  // Оптимизированное обновление состояния
  useEffect(() => {
    updateMenuState?.({ isMenuOpen, showBackground, isFading, isMobile })
  }, [isMenuOpen, showBackground, isFading, isMobile, updateMenuState])

  return (
    <div className="header__dropdown">
      {showBackground && isMobile && (
        <div
          className="dropdown--background"
          style={{
            animation: isFading
              ? `fade-out ${FADE_OUT_DURATION}ms ease`
              : `fade-in ${FADE_IN_DURATION}ms ease`,
          }}></div>
      )}

      {showBackground && !isMobile && (
        <div
          className="dropdown--background-mobile"
          style={{
            animation: isFading
              ? `fade-out ${FADE_OUT_DURATION}ms ease`
              : `fade-in ${FADE_IN_DURATION}ms ease`,
          }}></div>
      )}

      <SoundWrapper>
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
      </SoundWrapper>

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

export const ButtonDropdown = memo(ButtonDropdownComponent)
