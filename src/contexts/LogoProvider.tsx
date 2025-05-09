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

  // Константы для анимации, такие же как в ButtonDropdown
  const FADE_IN_DURATION = 300
  const FADE_OUT_DURATION = 300

  return (
    <MenuContext.Provider value={value}>
      {/* Фоновые элементы на уровне страницы */}
      {menuState.showBackground && menuState.isMobile && (
        <div
          className="bg-foreground dark:bg-background fixed inset-0 z-40"
          style={{
            animation: menuState.isFading
              ? `fade-out ${FADE_OUT_DURATION}ms ease`
              : `fade-in ${FADE_IN_DURATION}ms ease`,
          }}></div>
      )}

      {menuState.showBackground && !menuState.isMobile && (
        <div
          className="bg-linear-to-l from-foreground/20 from-0% to-transparent to-20% fixed inset-0 z-40"
          style={{
            animation: menuState.isFading
              ? `fade-out ${FADE_OUT_DURATION}ms ease`
              : `fade-in ${FADE_IN_DURATION}ms ease`,
          }}></div>
      )}
      
      {children}
    </MenuContext.Provider>
  )
}
