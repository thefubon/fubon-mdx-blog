// src/components/global/header/index.tsx

"use client"

import SoundWrapper from '@/components/SoundWrapper'
import { MenuProvider } from '@/contexts/LogoProvider'
import Logo from './Logo'
import ButtonContact from './ButtonContact'
import { ButtonDropdown } from './ButtonDropdown'
import { WaveButton } from '@/components/wave-button'
import { AtSign } from 'lucide-react'
import { useEffect, useState } from 'react'


export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
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

  return (
    <MenuProvider>
      <header
        className={`px-[var(--padding-x)] sticky top-0 z-50 md:py-4 transition-all duration-300 ease-in-out ${
          isHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          // Для мобильных устройств стили header при прокрутке
          isMobile && isScrolled
            ? 'bg-background/80 backdrop-blur-sm'
            : 'bg-transparent'
        }`}>
        <div
          className={`h-[clamp(80px,8vw,100px)] rounded-full flex justify-between items-center gap-x-4 transition-all duration-300 ease-in-out ${
            // Для десктопа стили применяются к внутреннему div
            !isMobile && isScrolled
              ? 'bg-background/80 backdrop-blur-sm shadow-2xl dark:shadow shadow-blue-200/50 dark:shadow-blue-200/20 pl-8 pr-6 mx-4'
              : 'bg-transparent px-0 mx-0'
          }`}>
          <div>
            <Logo />
          </div>

          <div className="inline-flex justify-end items-center gap-x-2 md:gap-x-4 static md:relative">
            <SoundWrapper>
              <WaveButton
                size="lg"
                pulseWhenIdle={true}
                showTrackName={true}
              />
            </SoundWrapper>

            <SoundWrapper>
              <ButtonContact
                href="mailto:hello@fubon.ru"
                className="hidden md:inline-block"
                aria-label="Отправить Email">
                <div className="flex items-center gap-x-2">
                  <AtSign />
                  <span>Почта</span>
                </div>
              </ButtonContact>
            </SoundWrapper>

            <ButtonDropdown />
          </div>
        </div>
      </header>
    </MenuProvider>
  )
}
