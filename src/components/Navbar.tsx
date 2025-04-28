'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLenis } from '@/components/LenisProvider' // Укажите правильный путь к вашему провайдеру

type NavLink = {
  label: string
  href: string
  icon?: any
}

type Props = {
  navLinks: NavLink[]
}

export default function Navbar({ navLinks }: Props) {
  const pathname = usePathname()
  const lenis = useLenis() // Получаем экземпляр Lenis

  // Функция для плавного скролла к секциям
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Если это якорная ссылка на текущей странице
    if (href.startsWith('#')) {
      e.preventDefault()
      lenis?.scrollTo(href, {
        offset: -100, // Отступ от верха, при необходимости
        duration: 1.5, // Продолжительность анимации в секундах
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Функция плавности
        immediate: false, // Плавная анимация
      })
    }
  }

  return (
    <nav className="grid gap-2">
      {navLinks.map((link) => {
        const isActive = pathname === link.href

        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`${isActive && 'text-light-primary'} font-medium`}>
            {link.icon}
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
