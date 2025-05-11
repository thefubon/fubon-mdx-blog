// src/components/global/header/index.tsx

"use client"

import SoundWrapper from '@/components/SoundWrapper'
import { MenuProvider, useMenuContext } from '@/contexts/LogoProvider'
import Logo from './Logo'
import { ButtonDropdown } from './ButtonDropdown'
import { WaveButton } from '@/components/wave-button'
import { useEffect, useState, useRef } from 'react'
import { HorizontalMenu } from './HorizontalMenu'
import CartButton from '@/components/market/CartButton'

// Константы анимации, такие же как в LogoProvider
const FADE_OUT_DURATION = 300

const HeaderContent = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const { isMenuOpen } = useMenuContext()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Отслеживаем изменение состояния меню
  useEffect(() => {
    // Capture the current timer reference
    const currentTimerRef = timerRef.current;
    
    // Очистка при размонтировании
    return () => {
      if (currentTimerRef) {
        clearTimeout(currentTimerRef)
      }
    }
  }, [isMenuOpen, isMobile])
  
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
      if (currentScrollY > 120) {
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

  return (
    <header
      className={`px-[var(--padding-x)] sticky top-0 z-50 md:py-4 transition-all ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      } bg-transparent`}
      style={{
        transitionDuration: `${FADE_OUT_DURATION}ms`,
        transitionTimingFunction: 'ease',
      }}>
      <div
        className={`h-[clamp(80px,8vw,100px)] rounded-full flex justify-between items-center gap-x-4 transition-all ${
          // Только для десктопа применяем стили фона
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
                showTrackName={false}
              />
            </SoundWrapper>
  
          
          <CartButton />
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
