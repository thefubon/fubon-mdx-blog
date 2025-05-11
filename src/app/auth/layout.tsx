import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Авторизация',
  description: 'Страница авторизации Fubon',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: '/auth/login',
  },
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  )
} 