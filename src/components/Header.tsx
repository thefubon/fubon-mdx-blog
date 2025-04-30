// src/components/Header.tsx
import Link from 'next/link'
import { Button } from './ui/button'
import Logo from './Logo'
import Dropdown from './Dropdown'

export default function Header() {
  return (
    <header id="header">
      <div>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="header__end">
        <Button
          asChild
          size="default"
          className="hidden md:inline-block">
          <Link
            href="mailto:hello@fubon.ru"
            aria-label="Отправить Email">
            Let&prime;s talk
          </Link>
        </Button>

        <Dropdown />
      </div>
    </header>
  )
}
