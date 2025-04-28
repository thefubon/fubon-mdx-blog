// src/components/Header.tsx или подобный компонент навигации
import Link from 'next/link'
import { Button } from './ui/button'
import { ModeToggle } from './ModeToggle'
import Navbar from './Navbar'
import Logo from './Logo'
import Player from './Player'

const navItems = [
  { label: 'Блог', href: '/blog' }
]

export default function Header() {
  return (
    <header className="bg-background shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="font-bold text-xl">
          <Logo/>
        </Link>

        <Navbar navLinks={navItems} />

        <div className='flex justify-end gap-x-4'>
          <Player/>

          <Button asChild size="lg">
            <Link
              href="mailto:hello@fubon.ru"
              aria-label="Отправить Email">
              Lest&prime;s talk
            </Link>
          </Button>

          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
