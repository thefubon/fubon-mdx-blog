'use client'

import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import LogoutButton from './LogoutButton'

export default function UserProfile() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }
  
  if (!session?.user) {
    return null
  }
  
  const { user } = session
  
  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
          <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <LogoutButton>Выйти</LogoutButton>
    </div>
  )
} 