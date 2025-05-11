import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Панель управления',
  description: 'Основная информация и статистика',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в панель управления
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-xl font-semibold">Статистика</h3>
          <p className="text-muted-foreground">Просмотр статистики сайта</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-xl font-semibold">Контент</h3>
          <p className="text-muted-foreground">Управление контентом</p>
        </div>
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-xl font-semibold">Пользователи</h3>
          <p className="text-muted-foreground">Управление пользователями</p>
        </div>
      </div>
    </div>
  )
} 