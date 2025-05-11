'use client'

import { menuItems } from '@/data/navbar'
import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

export default function BottomTabBar() {
  const currentUrl = usePathname()

  return (
    <div className="bg-background lg:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {menuItems.map((item) => {
          const isActive = currentUrl === item.link || (item.link !== '/' && currentUrl.startsWith(item.link))
          return (
            <Link
              key={item.link}
              href={item.link}
              className={`flex flex-col items-center justify-center w-full py-2 ${
                isActive ? 'text-primary' : 'text-fubon-foreground/70'
              }`}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
