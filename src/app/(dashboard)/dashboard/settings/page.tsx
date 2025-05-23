import { Metadata } from 'next'
import { requireAuth } from '@/components/auth/requireAuth'

export const metadata: Metadata = {
  title: 'Настройки',
  description: 'Управление настройками аккаунта',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function SettingsPage() {
  // This will redirect to login if user is not authenticated
  await requireAuth()
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">
          Управление настройками аккаунта
        </p>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-xl font-semibold">Основные настройки</h3>
          <p className="text-muted-foreground">Настройки учетной записи и уведомлений</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-xl font-semibold">Безопасность</h3>
          <p className="text-muted-foreground">Настройки пароля и двухфакторной аутентификации</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-xl font-semibold">Интеграции</h3>
          <p className="text-muted-foreground">Настройки подключенных сервисов</p>
        </div>
      </div>
    </div>
  )
} 