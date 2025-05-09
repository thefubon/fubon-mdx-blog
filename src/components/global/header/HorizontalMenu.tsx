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
        {menuItems.map((item) =>
          currentUrl === item.link ? (
            <li key={item.link} className="group relative flex items-center">
              <div className="relative inline-flex items-center overflow-hidden text-[length:var(--font-size-h6)] uppercase text-primary font-medium">
                <span>
                  {item.name}
                </span>
              </div>
            </li>
          ) : (
            <li key={item.link} className="group relative flex items-center">
              <SoundWrapper>
                <Link
                  href={item.link}
                  aria-label={item.name}
                  className="relative inline-flex items-center overflow-hidden text-[length:var(--font-size-h6)] uppercase"
                >
                  <span className="relative transition-transform duration-500 delay-75 ease-in-out group-hover:-translate-y-full">
                    {item.name}
                  </span>
                  <span className="absolute top-full left-0 transition-transform duration-500 delay-75 ease-in-out group-hover:-translate-y-full">
                    {item.name}
                  </span>
                </Link>
              </SoundWrapper>
            </li>
          )
        )}
      </ul>
    </nav>
  )
}

export const HorizontalMenu = memo(HorizontalMenuComponent) 