// src/contexts/LogoProvider.tsx
'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from 'react'

type MenuContextType = {
  isMenuOpen: boolean
  showBackground: boolean
  isFading: boolean
  isMobile: boolean
  updateMenuState?: (state: Partial<MenuContextType>) => void
}

export const MenuContext = createContext<MenuContextType>({
  isMenuOpen: false,
  showBackground: false,
  isFading: false,
  isMobile: false,
})

export const useMenuContext = () => useContext(MenuContext)

export const MenuProvider = ({ children }: { children: ReactNode }) => {
  const [menuState, setMenuState] = useState({
    isMenuOpen: false,
    showBackground: false,
    isFading: false,
    isMobile: false,
  })

  const updateMenuState = useCallback((newState: Partial<MenuContextType>) => {
    setMenuState((prev) => {
      const updatedState = { ...prev, ...newState }
      // Обновляем только если что-то действительно изменилось
      if (JSON.stringify(prev) === JSON.stringify(updatedState)) {
        return prev
      }
      return updatedState
    })
  }, [])

  const value = useMemo(
    () => ({
      ...menuState,
      updateMenuState,
    }),
    [menuState, updateMenuState]
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}
