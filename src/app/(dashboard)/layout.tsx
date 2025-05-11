import { Metadata } from 'next'
import { requireAuth } from '@/components/auth/requireAuth'
import { DashboardHeader, DashboardSidebar } from '@/components/dashboard'

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
      {/* Mobile Header - Visible on mobile only */}
      <DashboardHeader />
      
      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile */}
        <DashboardSidebar />
        
        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
} 