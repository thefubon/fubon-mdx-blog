'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function DashboardSidebar() {
  const { itemCount } = useCart();
  
  return (
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
                className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                На сайт
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                Главная
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/market"
                className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                <span>Мои покупки</span>
                {itemCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-black">
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                Настройки
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/profile"
                className="block rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent">
                Профиль
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  )
} 