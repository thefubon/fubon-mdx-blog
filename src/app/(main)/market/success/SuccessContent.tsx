'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingBag, Check, ChevronRight, Home, User } from 'lucide-react'
import { useCart, CartItem } from '@/contexts/CartContext'

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const orderDate = new Date().toLocaleDateString('ru-RU', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  const { clearCart, items, orderHistory } = useCart()
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([])
  
  // Сохраняем список купленных товаров и очищаем корзину
  useEffect(() => {
    if (items && items.length > 0) {
      setPurchasedItems([...items])
      clearCart()
    } else if (orderHistory.length > 0) {
      // Берем товары из последнего заказа, если корзина пуста
      setPurchasedItems([...orderHistory[0].items])
    }
  }, [items, clearCart, orderHistory])

  // Форматирование цены
  const formatPrice = (price: string | number): string => {
    if (typeof price === 'number') {
      return `${price} ₽`
    }
    return price
  }

  // Вычисление общей стоимости
  const calculateTotal = () => {
    return purchasedItems.reduce((sum, item) => {
      const itemPrice = typeof item.price === 'number' 
        ? item.price 
        : parseFloat(item.price.replace(/[^\d.]/g, '')) || 0
      return sum + (itemPrice * item.quantity)
    }, 0)
  }

  return (
    <div className="mt-8 mb-16 max-w-3xl mx-auto">
      {/* Хлебные крошки */}
      <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
        <Link
          href="/"
          className="flex items-center hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <Home className="w-4 h-4 mr-1" />
          <span>Главная</span>
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <Link
          href="/market"
          className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          Цифровые товары
        </Link>
        <ChevronRight className="w-4 h-4 mx-1" />
        <span className="text-gray-900 dark:text-gray-200 font-medium">
          Успешная покупка
        </span>
      </nav>

      {/* Заголовок и содержимое */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
            <Check className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Спасибо за покупку!</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Ваш заказ успешно оформлен и оплачен.
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium mb-6">
            Номер заказа: <span className="font-bold">{orderNumber}</span> от {orderDate}
          </div>
        </div>

        {/* Список купленных товаров */}
        {purchasedItems.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Купленные товары:</h2>
            <div className="space-y-4">
              {purchasedItems.map((item) => (
                <div key={item.slug} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0 relative w-16 h-16 rounded-md overflow-hidden mr-4">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-600 w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.title}</h3>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300 text-sm">
                        Количество: {item.quantity}
                      </span>
                      <span className="font-bold text-primary">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <span className="font-medium">Итого:</span>
              <span className="text-xl font-bold text-primary">
                {calculateTotal()} ₽
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
            <p className="text-center text-gray-600 dark:text-gray-300">
              Информация о покупке недоступна.
            </p>
          </div>
        )}

        {/* Инструкции и следующие шаги */}
        <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-300">Что дальше?</h2>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">1</span>
              </span>
              <span>
                Вы можете скачать купленные товары в своем <Link href="/dashboard/market" className="text-blue-600 dark:text-blue-400 hover:underline">личном кабинете</Link>.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">2</span>
              </span>
              <span>
                Квитанция о покупке отправлена на ваш email и доступна в разделе заказов.
              </span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center mr-2 mt-0.5">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">3</span>
              </span>
              <span>
                При возникновении вопросов обращайтесь в службу поддержки.
              </span>
            </li>
          </ul>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            variant="default"
            size="lg"
            className="sm:flex-1 gap-2"
          >
            <Link href="/dashboard/market">
              <User className="w-5 h-5" />
              Мои покупки
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            size="lg"
            className="sm:flex-1 gap-2"
          >
            <Link href="/market">
              <ShoppingBag className="w-5 h-5" />
              Продолжить покупки
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 