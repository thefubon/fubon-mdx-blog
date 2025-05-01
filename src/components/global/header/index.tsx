// src/components/Header.tsx
import Link from 'next/link'
import Logo from './Logo'
import ButtonContact from './ButtonContact'
import ButtonDropdown from './ButtonDropdown'
import { SoundToggle } from '@/components/SoundToggle'
import SoundWrapper from '@/components/SoundWrapper'

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__start">
          <Link
            href="/"
            aria-label="Переход на главную страницу">
            <Logo />
          </Link>
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
  )
}
