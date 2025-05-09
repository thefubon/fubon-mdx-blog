// src/components/global/header/index.tsx

"use client"

import SoundWrapper from '@/components/SoundWrapper'
import { MenuProvider, useMenuContext } from '@/contexts/LogoProvider'
import Logo from './Logo'
import ButtonContact from './ButtonContact'
import { ButtonDropdown } from './ButtonDropdown'
import { WaveButton } from '@/components/wave-button'
import { useEffect, useState, useRef } from 'react'
import { HorizontalMenu } from './HorizontalMenu'

// Константы анимации, такие же как в LogoProvider
const FADE_OUT_DURATION = 300
const HIDE_DELAY = 200

const HeaderContent = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const { isMenuOpen } = useMenuContext()
  const [showHeaderBg, setShowHeaderBg] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Отслеживаем изменение состояния меню
  useEffect(() => {
    // Если меню закрывается
    if (!isMenuOpen) {
      // Очищаем предыдущий таймер, если он был
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      // Устанавливаем таймер для появления фона после закрытия меню
      timerRef.current = setTimeout(() => {
        setShowHeaderBg(true)
      }, FADE_OUT_DURATION + HIDE_DELAY)
    } else {
      // Если меню открывается, сразу скрываем фон
      setShowHeaderBg(false)
    }
    
    // Очистка при размонтировании
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isMenuOpen])
  
  useEffect(() => {
    // Определяем, является ли устройство мобильным
    const checkIsMobile = () => {
      return window.innerWidth < 768
    }
    
    const handleResize = () => {
      setIsMobile(checkIsMobile())
    }
    
    // Инициализация и добавление слушателя изменения размера окна
    setIsMobile(checkIsMobile())
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Determine if scrolled past initial threshold
      if (currentScrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
      
      // Hide header when scrolling down past 600px
      if (currentScrollY > 600) {
        if (currentScrollY > lastScrollY) {
          setIsHidden(true) // Scrolling down
        } else {
          setIsHidden(false) // Scrolling up
        }
      } else {
        setIsHidden(false) // Always show when less than 600px
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Определяем, нужно ли показывать фон в мобильной версии
  const shouldShowMobileBg = isMobile && isScrolled && !isMenuOpen && showHeaderBg

  return (
    <header
      className={`px-[var(--padding-x)] sticky top-0 z-50 md:py-4 transition-all ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        // Для мобильных устройств стили header при прокрутке
        // Не добавляем фон, если меню открыто в мобильной версии
        shouldShowMobileBg
          ? 'bg-background/80 backdrop-blur-sm'
          : 'bg-transparent'
      }`}
      style={{
        transitionDuration: `${FADE_OUT_DURATION}ms`,
        transitionTimingFunction: 'ease',
      }}>
      <div
        className={`h-[clamp(80px,8vw,100px)] rounded-full flex justify-between items-center gap-x-4 transition-all ${
          // Для десктопа стили применяются к внутреннему div
          !isMobile && isScrolled
            ? 'bg-background/80 backdrop-blur-sm pl-8 pr-6 mx-4'
            : 'bg-transparent px-0 mx-0'
        }`}
        style={{
          transitionDuration: `${FADE_OUT_DURATION}ms`,
          transitionTimingFunction: 'ease',
        }}>
        <div className="flex-shrink-0">
          <Logo />
        </div>

        {/* Горизонтальное меню */}
        <div className="hidden md:flex flex-1 justify-center">
          <HorizontalMenu />
        </div>

        <div className="inline-flex justify-end items-center gap-x-2 md:gap-x-4 static md:relative flex-shrink-0">
          <SoundWrapper>
            <WaveButton
              size="lg"
              pulseWhenIdle={true}
              showTrackName={true}
            />
          </SoundWrapper>

          <div className="hidden lg:inline-block">
            <SoundWrapper>
              <ButtonContact
                href="mailto:hello@fubon.ru"
                aria-label="Отправить Email">
                <div className="flex items-center gap-x-2">
                  Начать<span className='hidden xl:inline-block'> проект</span>
                </div>
              </ButtonContact>
            </SoundWrapper>
          </div>

          <ButtonDropdown />
        </div>
      </div>
    </header>
  )
}

export default function Header() {
  return (
    <MenuProvider>
      <HeaderContent />
    </MenuProvider>
  )
}
