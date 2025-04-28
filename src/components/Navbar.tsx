'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLenis } from './LenisProvider'
import { ReactNode } from 'react'

type NavLink = {
  label: string
  href: string
  icon?: ReactNode // Используем ReactNode вместо any
}

type Props = {
  navLinks: NavLink[]
}

export default function Navbar({ navLinks }: Props) {
  const pathname = usePathname()
  const lenis = useLenis()

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      lenis?.scrollTo(href, {
        offset: -100,
        duration: 1.5,
        immediate: false,
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
            className={`${isActive && 'text-blue-600'} font-medium flex items-center gap-x-3`}>
            {link.icon}
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
