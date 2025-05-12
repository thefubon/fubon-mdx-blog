'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { menuItems } from '@/data/navbar'
import { memo } from 'react'
import SoundWrapper from '@/components/SoundWrapper'

const HorizontalMenuComponent = () => {
  const currentUrl = usePathname()

  return (
    <nav className="hidden lg:flex items-center relative -mb-1.5">
      <ul className="flex items-center space-x-8">
        {menuItems.map((item) => {
          const isActive = currentUrl === item.link || 
                         (item.link !== '/' && currentUrl?.startsWith(item.link))
          
          return isActive ? (
            <li
              key={item.link}
              className="group relative flex items-center">
              <div className="relative inline-flex items-center gap-x-2 overflow-hidden text-[length:var(--font-size-h6)] text-primary">
                <span className="size-6 hidden xl:block">{item.icon}</span>
                <span>{item.name}</span>
              </div>
            </li>
          ) : (
            <li
              key={item.link}
              className="group relative flex items-center">
              <SoundWrapper>
                <Link
                  href={item.link}
                  prefetch={true}
                  aria-label={item.name}
                  className="relative inline-flex items-center overflow-hidden text-[length:var(--font-size-h6)]">
                  <div className="relative flex items-center gap-x-2 transition-transform duration-500 delay-75 ease-in-out group-hover:-translate-y-full">
                    <span className="size-6 hidden xl:block">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  <div className="absolute top-full left-0 flex items-center gap-x-2 transition-transform duration-500 delay-75 ease-in-out group-hover:-translate-y-full">
                    <span className="size-6 hidden xl:block">{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              </SoundWrapper>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export const HorizontalMenu = memo(HorizontalMenuComponent) 