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
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <MenuProvider>
      <header className="px-[var(--padding-x)] sticky top-0 z-50 py-4">
        <div
          className={`h-[clamp(80px,8vw,100px)] rounded-full flex justify-between items-center gap-x-4 transition-all duration-300 ease-in-out ${
            isScrolled
              ? 'bg-background shadow-2xl dark:shadow shadow-blue-200/50 dark:shadow-blue-200/20 pl-8 pr-6'
              : 'bg-transparent px-0'
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
