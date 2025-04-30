// src/components/Header.tsx
import { Link } from 'next-view-transitions'
import { Button } from './ui/button'
import Navbar from './Navbar'
import Logo from './Logo'
import { FileMusic, LayoutDashboard, Rabbit } from 'lucide-react'
import Dropdown from './Dropdown'
import { menuItems } from '@/data/navbar'

// Карта иконок
const iconComponents = {
  'Rabbit': <Rabbit />,
  'LayoutDashboard': <LayoutDashboard />,
  'FileMusic': <FileMusic />
}

// Преобразование данных из menuItems в формат, необходимый для Navbar
const navItems = menuItems.map(item => ({
  label: item.name,
  href: item.link,
  icon: item.iconName ? iconComponents[item.iconName as keyof typeof iconComponents] : undefined
}))

export default function Header() {
  return (
    <header id="header">
      <div>
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <div className="hidden md:inline-block">
        <Navbar navLinks={navItems} />
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
