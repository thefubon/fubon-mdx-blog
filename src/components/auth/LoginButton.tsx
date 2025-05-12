'use client'

import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface LoginButtonProps {
  provider: string
  children: ReactNode
  className?: string
  returnToMarket?: boolean
}

export default function LoginButton({ provider, children, className, returnToMarket }: LoginButtonProps) {
  return (
    <Button
      onClick={() => signIn(provider, { 
        callbackUrl: returnToMarket ? '/market' : '/dashboard',
        ...(returnToMarket && { returnToMarket: 'true' })
      })}
      className={className}
    >
      {children}
    </Button>
  )
} 