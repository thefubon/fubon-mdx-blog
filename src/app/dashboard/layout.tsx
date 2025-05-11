import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Панель управления',
  description: 'Панель управления Fubon',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/dashboard',
  },
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-xl font-bold">Панель управления</h2>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                    На сайт
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings" className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                    Настройки
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
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