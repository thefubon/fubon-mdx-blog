// src/components/global/header/index.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import SoundWrapper from '@/components/SoundWrapper'
import { MenuProvider } from '@/contexts/LogoProvider'
import Logo from './Logo'
import ButtonContact from './ButtonContact'
import { ButtonDropdown } from './ButtonDropdown'
import { WaveButton } from '@/components/wave-button'


export default function Header() {
  const [scrollY, setScrollY] = useState(0)
  const [prevScrollY, setPrevScrollY] = useState(0)
  const [visible, setVisible] = useState(true)
  const headerRef = useRef<HTMLElement | null>(null)
  
  useEffect(() => {
    // Инициализируем начальное состояние
    const initialScrollY = window.scrollY
    setScrollY(initialScrollY)
    setPrevScrollY(initialScrollY)
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingDown = currentScrollY > prevScrollY
      
      // Получаем высоту меню
      const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 0
      
      // При скролле вниз - скрываем меню только когда проскроллили больше высоты меню
      if (scrollingDown && currentScrollY > headerHeight) {
        setVisible(false)
      } 
      // При скролле вверх - показываем меню
      else if (!scrollingDown) {
        setVisible(true)
      }
      
      setPrevScrollY(currentScrollY)
      setScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollY])

  // Классы для хедера
  const headerClasses = `
    header 
    transition-all 
    duration-300
    sticky top-0
    ${scrollY > 0 ? 'bg-background' : 'bg-transparent'} 
    ${!visible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
  `.trim()

  return (
    <MenuProvider>
      <header ref={headerRef} className={headerClasses}>
        <div className="header__container">
          <div className="header__start">
            <Logo />
          </div>

          <div className="header__end">
            <SoundWrapper>
              <WaveButton
                size="lg"
                pulseWhenIdle={true}
              />
            </SoundWrapper>

            <SoundWrapper>
              <ButtonContact
                href="mailto:hello@fubon.ru"
                className="header__contact-btn"
                aria-label="Отправить Email">
                Контакты
              </ButtonContact>
            </SoundWrapper>

            <ButtonDropdown />
          </div>
        </div>
      </header>
    </MenuProvider>
  )
}
