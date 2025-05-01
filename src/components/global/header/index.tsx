// src/components/global/header/index.tsx
'use client'

import { useState } from 'react'
import Logo from './Logo'
import ButtonContact from './ButtonContact'
import ButtonDropdown from './ButtonDropdown'
import { SoundToggle } from '@/components/SoundToggle'
import SoundWrapper from '@/components/SoundWrapper'
import { MenuContext } from '@/contexts/MenuContext'

export default function Header() {
  const [menuState, setMenuState] = useState({
    isMenuOpen: false,
    showBackground: false,
    isFading: false,
    isMobile: false,
  })

  const updateMenuState = (newState: Partial<typeof menuState>) => {
    setMenuState((prev) => ({ ...prev, ...newState }))
  }

  return (
    <MenuContext.Provider value={menuState}>
      <header className="header">
        <div className="header__container">
          <div className="header__start">
            <Logo />
          </div>

          <div className="header__end">
            <SoundToggle />
            <SoundWrapper>
              <ButtonContact
                href="mailto:hello@fubon.ru"
                className="header__contact-btn"
                aria-label="Отправить Email">
                Контакты
              </ButtonContact>
            </SoundWrapper>

            <ButtonDropdown updateMenuState={updateMenuState} />
          </div>
        </div>
      </header>
    </MenuContext.Provider>
  )
}
