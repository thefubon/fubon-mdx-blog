// src/components/global/header/index.tsx

"use client"

import { MenuProvider, useMenuContext } from '@/contexts/LogoProvider'
import Logo from './Logo'
import { ButtonDropdown } from './ButtonDropdown'
import { useEffect, useState, useRef, memo } from 'react'
import { HorizontalMenu } from './HorizontalMenu'
import CartButton from '@/components/market/CartButton'
import UserButton from '@/components/auth/UserButton'

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
    
    // Добавляем debounce для обработчика resize
    let resizeTimer: NodeJS.Timeout | null = null;
    
    const debouncedResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize)
    
    return () => {
      window.removeEventListener('resize', debouncedResize)
      if (resizeTimer) clearTimeout(resizeTimer);
    }
  }, [])
  
  useEffect(() => {
    // Используем requestAnimationFrame для оптимизации обработчика прокрутки
    let ticking = false;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Determine if scrolled past initial threshold
      if (currentScrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }

      // Скрытие заголовка при прокрутке вниз
      if (currentScrollY > 320) {
        if (currentScrollY > lastScrollY) {
          setIsHidden(true) // Scrolling down
        } else {
          setIsHidden(false) // Scrolling up
        }
      } else {
        setIsHidden(false) // Always show when less than 600px
      }

      setLastScrollY(currentScrollY)
      ticking = false
    }
    
    const onScroll = () => {
      if (!ticking) {
        // Используем requestAnimationFrame для оптимизации
        window.requestAnimationFrame(() => {
          handleScroll();
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
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
        className={`h-[clamp(80px,8vw,100px)] rounded-full flex items-center justify-between gap-x-4 transition-all ${
          // Только для десктопа применяем стили фона
          !isMobile && isScrolled
            ? 'bg-background/80 backdrop-blur-sm pl-8 pr-6 mx-24 lg:mx-4 2xl:mx-32'
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
        <div className="hidden md:flex justify-center">
          <HorizontalMenu />
        </div>

        <div className="inline-flex justify-end items-center gap-x-2 md:gap-x-4 static md:relative flex-shrink-0">
          <CartButton />
          <UserButton />
          <ButtonDropdown />
        </div>
      </div>
    </header>
  )
}

// Используем memo для предотвращения ненужных перерендеров
const MemoizedHeaderContent = memo(HeaderContent)

export default function Header() {
  return (
    <MenuProvider>
      <MemoizedHeaderContent />
    </MenuProvider>
  )
}
