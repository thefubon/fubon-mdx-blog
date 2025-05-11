import Link from 'next/link'
import { Metadata } from 'next'
import { requireAuth } from '@/components/auth/requireAuth'

export const metadata: Metadata = {
  title: {
    default: 'Панель управления',
    template: '%s | Панель управления',
  },
  description: 'Управление сайтом и контентом',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will redirect to login if user is not authenticated
  await requireAuth()
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-card md:block">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-xl font-bold">Панель управления</h2>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/" 
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    На сайт
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard" 
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    Главная
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard/settings" 
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    Настройки
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard/profile" 
                    className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    Профиль
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
} 