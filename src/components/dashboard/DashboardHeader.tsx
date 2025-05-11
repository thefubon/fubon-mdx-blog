'use client';

import Link from 'next/link';
import { Menu, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function DashboardHeader() {
  const { items, itemCount, removeItem } = useCart();

  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' 
      ? item.price 
      : parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
    return sum + itemPrice;
  }, 0);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
      <div className="font-semibold">Панель управления</div>
      
      <div className="flex items-center gap-2">
        {/* Market Cart Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-md border">
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-black">
                  {itemCount}
                </span>
              )}
            </button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Корзина</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 flex flex-col gap-6">
              {items.length > 0 ? (
                <>
                  <div className="flex flex-col gap-4">
                    {items.map((item) => (
                      <div key={item.slug} className="flex items-center gap-4 border-b pb-4">
                        {item.image && (
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <Image 
                              src={item.image} 
                              alt={item.title} 
                              fill 
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-primary font-bold">{item.price}</p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.slug)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          Удалить
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Итого:</span>
                      <span>{totalPrice} ₽</span>
                    </div>
                    
                    <Button>
                      Оформить заказ
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">Ваша корзина пуста</p>
                  <Link href="/market">
                    <Button>Перейти в каталог</Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Navigation Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-md border">
              <Menu size={18} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/" className="flex w-full cursor-pointer">
                На сайт
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="flex w-full cursor-pointer">
                Главная
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/market" className="flex w-full cursor-pointer items-center justify-between">
                <span>Мои покупки</span>
                {itemCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-black">
                    {itemCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex w-full cursor-pointer">
                Настройки
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile" className="flex w-full cursor-pointer">
                Профиль
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/market" className="flex w-full cursor-pointer items-center justify-between">
                <span>Маркет</span>
                {itemCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-black">
                    {itemCount}
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 