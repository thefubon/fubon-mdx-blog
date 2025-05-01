// src/components/global/header/index.tsx
'use client'

import SoundWrapper from '@/components/SoundWrapper'
import { SoundToggle } from '@/components/SoundToggle'
import { MenuProvider } from '@/contexts/LogoProvider'
import Logo from './Logo'
import ButtonContact from './ButtonContact'
import { ButtonDropdown } from './ButtonDropdown'


export default function Header() {
  return (
    <MenuProvider>
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

            <ButtonDropdown />
          </div>
        </div>
      </header>
    </MenuProvider>
  )
}
