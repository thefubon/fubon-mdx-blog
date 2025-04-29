// src/components/Header.tsx или подобный компонент навигации
import { Link } from 'next-view-transitions'
import { Button } from './ui/button'
import { ModeToggle } from './ModeToggle'
import Navbar from './Navbar'
import Logo from './Logo'
import Player from './Player'
import { FileMusic, LayoutDashboard } from 'lucide-react'


const navItems = [
  { label: 'Блог', href: '/blog', icon: <LayoutDashboard /> },
  { label: 'Музка', href: '/music', icon: <FileMusic /> },
]

export default function Header() {
  return (
    <header id='header'>
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
