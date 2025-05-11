'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Users, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Content counts interface
interface ContentCounts {
  blogPosts: number;
  marketItems: number;
  workProjects: number;
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [contentCounts, setContentCounts] = useState<ContentCounts>({
    blogPosts: 0,
    marketItems: 0,
    workProjects: 0
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminAuth = localStorage.getItem('adminAuth');
    if (!adminAuth) {
      router.push('/admin/login');
    } else {
      setIsAdmin(true);
      
      // Fetch content counts
      const fetchContentCounts = async () => {
        try {
          const response = await fetch('/api/admin/content-counts');
          if (response.ok) {
            const counts = await response.json();
            setContentCounts(counts);
          }
        } catch (error) {
          console.error('Failed to fetch content counts:', error);
        }
      };
      
      fetchContentCounts();
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Панель администрирования</h1>
          <p className="text-muted-foreground">
            Управление сайтом и контентом
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6 shadow">
          <div className="flex items-center gap-3 mb-3">
            <BarChart className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Статистика</h3>
          </div>
          <p className="text-muted-foreground mb-4">Просмотр статистики сайта</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Посетители сегодня:</span>
              <span className="font-medium">247</span>
            </div>
            <div className="flex justify-between">
              <span>Просмотры страниц:</span>
              <span className="font-medium">1,358</span>
            </div>
            <div className="flex justify-between">
              <span>Конверсия:</span>
              <span className="font-medium">3.2%</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Контент</h3>
          </div>
          <p className="text-muted-foreground mb-4">Управление контентом</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Статьи:</span>
              <span className="font-medium">{contentCounts.blogPosts}</span>
            </div>
            <div className="flex justify-between">
              <span>Товары:</span>
              <span className="font-medium">{contentCounts.marketItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Проекты:</span>
              <span className="font-medium">{contentCounts.workProjects}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6 shadow">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5" />
            <h3 className="text-xl font-semibold">Пользователи</h3>
          </div>
          <p className="text-muted-foreground mb-4">Управление пользователями</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Всего пользователей:</span>
              <span className="font-medium">1,254</span>
            </div>
            <div className="flex justify-between">
              <span>Новые сегодня:</span>
              <span className="font-medium">15</span>
            </div>
            <div className="flex justify-between">
              <span>Активные:</span>
              <span className="font-medium">876</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link href="/">
          <Button variant="outline">Вернуться на сайт</Button>
        </Link>
      </div>
    </div>
  );
} 