'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface LogoutButtonProps {
  children: ReactNode
  className?: string
}

export default function LogoutButton({ children, className }: LogoutButtonProps) {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: '/' })}
      variant="outline"
      className={className}
    >
      {children}
    </Button>
  )
} 