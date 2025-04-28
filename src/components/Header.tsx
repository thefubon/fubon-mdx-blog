// src/components/Header.tsx или подобный компонент навигации
import Link from 'next/link'
import { Button } from './ui/button'
import { ModeToggle } from './ModeToggle'
import Navbar from './Navbar'
import Logo from './Logo'
import Player from './Player'
import { LayoutDashboard } from 'lucide-react'

const navItems = [{ label: 'Блог', href: '/blog', icon: <LayoutDashboard /> }]

export default function Header() {
  return (
    <header className="header content-wrapper">
      <div>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div>
        <Navbar navLinks={navItems} />
      </div>

      <div className="header__end">
        <Player />

        <Button
          asChild
          size="lg">
          <Link
            href="mailto:hello@fubon.ru"
            aria-label="Отправить Email">
            Lest&prime;s talk
          </Link>
        </Button>

        <ModeToggle />
      </div>
    </header>
  )
}
