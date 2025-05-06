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
import SoundWrapper from '@/components/SoundWrapper'
import { MenuContext } from '@/contexts/LogoProvider'
import ButtonDropdownSettings from './ButtonDropdownSettings'
import SearchDropdown from './SearchDropdown'

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
    <div>
      {showBackground && isMobile && (
        <div
          className="bg-foreground dark:bg-background fixed inset-0"
          style={{
            animation: isFading
              ? `fade-out ${FADE_OUT_DURATION}ms ease`
              : `fade-in ${FADE_IN_DURATION}ms ease`,
          }}></div>
      )}

      {showBackground && !isMobile && (
        <div
          className="bg-muted/80 backdrop-blur-sm fixed inset-0"
          style={{
            animation: isFading
              ? `fade-out ${FADE_OUT_DURATION}ms ease`
              : `fade-in ${FADE_IN_DURATION}ms ease`,
          }}></div>
      )}

      <SoundWrapper>
        <button
          ref={buttonElement}
          className={`group animation-trigger bg-primary text-primary-foreground relative transition-colors duration-300 flex justify-center items-center gap-x-4 whitespace-nowrap cursor-pointer rounded-full size-12 md:w-auto md:h-[var(--button-height)] md:px-[var(--button-padding-x)] text-[length:var(--button-font-size)]  ${
            isMenuOpen ? 'bg-primary/90' : ''
          }`}
          aria-label="Кнопка открытия выпадающего меню"
          onClick={toggleMenu}>
          <div className="hidden relative w-full overflow-hidden md:inline-flex">
            <span
              className={`uppercase whitespace-nowrap transition-transform duration-500 ${
                isMenuOpen ? '-translate-y-full' : ''
              }`}>
              {menuButton}
            </span>
            <span
              className={`uppercase whitespace-nowrap transition-transform duration-500 absolute top-full ${
                isMenuOpen ? '-translate-y-full' : ''
              }`}>
              {menuButton}
            </span>
          </div>

          <div
            className={`flex items-center gap-x-1 group-hover:rotate-90 transition-transform duration-300 ${
              isMenuOpen ? 'rotate-90' : ''
            }`}>
            <span className="size-1.5 bg-primary-foreground rounded-full block"></span>
            <span className="size-1.5 bg-primary-foreground rounded-full block"></span>
          </div>
        </button>
      </SoundWrapper>

      <div
        ref={menuElement}
        className={`absolute inset-x-0 space-y-4 mt-6 md:mt-4 px-6 md:px-0 ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        data-lenis-prevent>
        <ul
          className={`bg-card text-card-foreground md:mt-4 py-6 space-y-0.5 rounded-lg transition-all duration-300 uppercase shadow-md ${
            isMenuOpen
              ? 'opacity-100 translate-z-0'
              : 'opacity-0 translate-y-[5.5em] rotate-[3.5deg] delay-150'
          }`}>
          {menuItems.map((item) =>
            currentUrl === item.link ? (
              <li
                key={item.link}
                className="py-2 px-6 relative flex justify-between items-center hover:bg-transparent text-[length:var(--dropdown-text)]">
                <span>{item.name}</span>
                <span className="size-3 bg-primary rounded-full block"></span>
              </li>
            ) : (
              <li
                key={item.link}
                className="group py-2 px-6 relative hover:bg-muted transition-all duration-300 flex justify-between items-center text-[length:var(--dropdown-text)]">
                <Link
                  href={item.link}
                  aria-label={item.name}
                  onClick={toggleMenu}
                  className="absolute z-10 inset-0"
                />
                <div className="relative w-full overflow-hidden md:inline-flex cursor-pointer">
                  <span className="whitespace-nowrap transition-transform duration-500 delay-75 ease-in-out group-hover:-translate-y-full">
                    {item.name}
                  </span>
                  <span className="whitespace-nowrap transition-transform duration-500 delay-75 ease-in-out hidden md:block absolute top-full group-hover:-translate-y-full">
                    {item.name}
                  </span>
                </div>

                <span className="opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none -translate-x-4 group-hover:translate-x-0 text-primary">
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
          className={`bg-card text-card-foreground p-6 rounded-lg shadow-md transition duration-[400ms] flex flex-col gap-4 ${
            isMenuOpen
              ? 'opacity-100 translate-z-0'
              : 'opacity-0 translate-y-[8em] rotate-[-3.5deg] delay-100'
          }`}>
          <ButtonDropdownSettings />
        </div>

        <div
          className={`bg-card text-card-foreground p-6 rounded-lg shadow-md transition duration-500 ${
            isMenuOpen
              ? 'opacity-100 translate-z-0'
              : 'opacity-0 translate-y-[9em] rotate-[-3.5deg] delay-75'
          }`}>
          <SearchDropdown onSearch={toggleMenu} />
        </div>
      </div>
    </div>
  )
}

export const ButtonDropdown = memo(ButtonDropdownComponent)
