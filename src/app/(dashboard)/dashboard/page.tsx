import { requireAuth } from '@/components/auth/requireAuth'
import UserProfile from '@/components/auth/UserProfile'
import { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Панель управления',
  description: 'Основная информация и статистика',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardPage() {
  // This will redirect to login if user is not authenticated
  await requireAuth()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в панель управления
        </p>
      </div>
      
      <UserProfile />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/market" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Мои покупки</h3>
          </div>
          <p className="text-muted-foreground">Управление приобретенными товарами</p>
        </Link>
        <Link href="/dashboard/profile" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <User className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Профиль</h3>
          </div>
          <p className="text-muted-foreground">Настройки вашего профиля</p>
        </Link>
        <Link href="/dashboard/settings" className="rounded-lg border bg-card p-6 shadow hover:bg-accent/50 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <Settings className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Настройки</h3>
          </div>
          <p className="text-muted-foreground">Управление настройками</p>
        </Link>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button asChild variant="outline">
          <Link href="/market">Перейти в маркет</Link>
        </Button>
      </div>
    </div>
  )
} 