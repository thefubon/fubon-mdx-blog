// src/components/Header.tsx
import Link from 'next/link'
import { Button } from './ui/button'
import Logo from './Logo'
import Dropdown from './Dropdown'
import ButtonAnimation from './ButtonAnimation'

export default function Header() {
  return (
    <header className="px-[var(--padding-x)] py-[clamp(16px,3vw,48px)] flex justify-between items-center sticky top-0 z-50">
      <div>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="inline-flex justify-end items-center gap-x-3 static md:relative">
        <ButtonAnimation
          href="mailto:hello@fubon.ru"
          className="hidden md:inline-block">
          Контакты
        </ButtonAnimation>

        <Dropdown />
      </div>
    </header>
  )
}
