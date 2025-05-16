'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, ShoppingBag, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function UserButton() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  
  // Пользователь в процессе аутентификации
  if (status === 'loading') {
    return (
      <div className="size-12 md:size-[var(--button-height)] rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }
  
  // Пользователь не авторизован, показываем иконку
  if (!session?.user) {
    return (
      <Button
        variant="secondary"
        size="icon"
        onClick={() => signIn()}
        aria-label="Войти"
        className="rounded-full size-12 md:size-[var(--button-height)] hover:bg-primary transition-all hover:text-white">
        <User className="size-6" />
      </Button>
    )
  }
  
  // Пользователь авторизован, показываем аватар и дропдаун
  const { user } = session
  const initials = user.name 
    ? `${user.name.charAt(0)}${user.name.split(' ')[1]?.charAt(0) || ''}`
    : user.email?.charAt(0).toUpperCase() || 'U'
  
  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full p-0 overflow-hidden size-12 md:size-[var(--button-height)] font-normal transition-all uppercase text-2xl"
          aria-label="Профиль пользователя">
          <Avatar className="size-12 md:size-[var(--button-height)] outline-none">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || 'Пользователь'}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 mt-1">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Мой профиль</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/market"
              className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Мои покупки</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/settings"
              className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 