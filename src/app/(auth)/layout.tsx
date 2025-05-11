import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Авторизация",
  description: "Страница авторизации в панель управления",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </div>
  )
} 