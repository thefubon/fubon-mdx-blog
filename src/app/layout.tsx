import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MDX Блог на Next.js 15',
  description: 'Блог создан с использованием Next.js 15 и MDX',
  // Добавляем метаданные для RSS-фида
  authors: [{ name: 'Ваше имя' }],
  // Добавляем альтернативные ссылки в метаданных Next.js
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/rss.xml',
          title: 'MDX Блог',
        },
      ],
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <footer className="bg-gray-100 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
            &copy; {new Date().getFullYear()} MDX Блог на Next.js 15
          </div>
        </footer>
      </body>
    </html>
  )
}
