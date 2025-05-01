// src/contexts/MenuContext.tsx
'use client'

import { createContext, useContext } from 'react'

type MenuContextType = {
  isMenuOpen: boolean
  showBackground: boolean
  isFading: boolean
  isMobile: boolean
}

export const MenuContext = createContext<MenuContextType>({
  isMenuOpen: false,
  showBackground: false,
  isFading: false,
  isMobile: false,
})

export const useMenuContext = () => useContext(MenuContext)
