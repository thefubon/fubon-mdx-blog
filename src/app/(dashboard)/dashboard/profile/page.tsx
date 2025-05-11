

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Профиль',
  description: 'Управление личными данными',
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Профиль пользователя</h1>
        <p className="text-muted-foreground">
          Управление личными данными
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-xl font-semibold">Личная информация</h3>
          <p className="text-muted-foreground mb-4">Основные данные профиля</p>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium">Имя:</p>
              <p>Антон Фубон</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>user@example.com</p>
            </div>
            <div>
              <p className="font-medium">Должность:</p>
              <p>Креативный директор</p>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6 shadow">
          <h3 className="text-xl font-semibold">Статистика активности</h3>
          <p className="text-muted-foreground mb-4">Данные о вашей активности</p>
          
          <div className="space-y-4">
            <div>
              <p className="font-medium">Дата регистрации:</p>
              <p>01.01.2023</p>
            </div>
            <div>
              <p className="font-medium">Последний вход:</p>
              <p>Сегодня, 12:30</p>
            </div>
            <div>
              <p className="font-medium">Активные проекты:</p>
              <p>5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 