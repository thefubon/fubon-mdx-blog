'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LogoutPage() {
  useEffect(() => {
    // Auto sign out after a brief delay
    const timer = setTimeout(() => {
      signOut({ callbackUrl: '/' })
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="container flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Выход из системы</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Выполняется выход из системы...</p>
          <div className="mt-4 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 