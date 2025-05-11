'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface LoginButtonProps {
  provider: string
  children: ReactNode
  className?: string
}

export default function LoginButton({ provider, children, className }: LoginButtonProps) {
  return (
    <Button
      onClick={() => signIn(provider, { callbackUrl: '/dashboard' })}
      className={className}
    >
      {children}
    </Button>
  )
} 