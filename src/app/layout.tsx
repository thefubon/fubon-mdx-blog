import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

import { ThemeProvider } from '@/components/ThemeProvider'
import { LenisProvider } from '@/components/LenisProvider'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Креативное агентство по дизайну и разработке. | Fubon',
  description:
    'Используя методы Data Science и лучшие практики UX-дизайна и проектирования продуктов, мы достигаем измеримых бизнес-результатов и создаем решения, которые отвечают потребностям пользователей и целям компании.',
  // Добавляем метаданные для RSS-фида
  authors: [{ name: 'Anthony Fubon' }],
  // Добавляем альтернативные ссылки в метаданных Next.js
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/rss.xml',
          title: 'Креативное агентство по дизайну и разработке. | Fubon',
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
    <html
      lang="ru"
      suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Header />
          <LenisProvider>
            <main className='flex-1'>{children}</main>
            <Footer />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
