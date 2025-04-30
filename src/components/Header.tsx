// src/components/Header.tsx
import Link from 'next/link'
import { Button } from './ui/button'
import Logo from './Logo'
import Dropdown from './Dropdown'

export default function Header() {
  return (
    <header className="px-[var(--padding-x)] py-[clamp(16px,3vw,48px)] flex justify-between items-center sticky top-0 z-50">
      <div>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="inline-flex justify-end gap-x-3 static md:relative">
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
