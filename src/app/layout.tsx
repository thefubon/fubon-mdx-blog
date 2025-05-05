import type { Metadata } from 'next'
import '@/styles/globals.css'

import { ThemeProvider } from '@/contexts/ThemeProvider'
import { SoundProvider } from '@/contexts/SoundProvider'

import Header from '@/components/global/header'
import Footer from '@/components/global/footer'

export const metadata: Metadata = {
  title: 'Fubon | Креативное агентство по дизайну и разработке.',
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
          title:
            'Fubon | Креативное агентство по дизайну и разработке.',
        },
      ],
    },
  },
  manifest: '/manifest.json',
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <SoundProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
