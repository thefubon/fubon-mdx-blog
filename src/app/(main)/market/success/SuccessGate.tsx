'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

interface SuccessGateProps {
  children: ReactNode
}

export default function SuccessGate({ children }: SuccessGateProps) {
  const router = useRouter()
  const { items, orderHistory } = useCart()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  
  // Проверка доступа на уровне компонента
  useEffect(() => {
    // Проверка условий доступа
    if (orderHistory.length > 0 || (items && items.length > 0)) {
      setIsAuthorized(true)
    } else {
      router.replace('/market')
    }
    setIsChecking(false)
  }, [router, items, orderHistory])
  
  // Пока идет проверка, вообще ничего не показываем
  if (isChecking) {
    return null
  }
  
  // Если нет авторизации, тоже ничего не показываем (будет редирект)
  if (!isAuthorized) {
    return null
  }

  // Если авторизация пройдена, отображаем содержимое
  return <>{children}</>
} 