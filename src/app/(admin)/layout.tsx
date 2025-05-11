import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Администрирование',
    template: '%s | Администрирование',
  },
  description: 'Панель администрирования сайта',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">{children}</main>
    </div>
  )
} 