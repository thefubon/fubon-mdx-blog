// src/components/Header.tsx
import Link from 'next/link'
import Logo from './Logo'
import ButtonContact from './ButtonContact'
import ButtonDropdown from './ButtonDropdown'

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
          <ButtonContact
            href="mailto:hello@fubon.ru"
            className="header__contact-btn"
            aria-label="Отправить Email">
            Контакты
          </ButtonContact>

          <ButtonDropdown />
        </div>
      </div>
    </header>
  )
}
