'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import PageWrapper from '@/components/PageWrapper';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Banknote, Truck, MapPin, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Определяем типы
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  paymentMethod: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardHolder?: string;
}

// Простые функции для форматирования ввода
const formatCardNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  const chunks = [];
  
  for (let i = 0; i < digitsOnly.length && i < 16; i += 4) {
    chunks.push(digitsOnly.slice(i, i + 4));
  }
  
  return chunks.join(' ');
};

const formatCardExpiry = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  
  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }
  
  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items,
    subtotal,
    discount,
    total,
    activePromoCode,
    applyPromoCode,
    clearPromoCode,
    saveOrder
  } = useCart();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    cardHolder: ''
  });
  
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Защита от проблем с гидратацией
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Попытка получить данные пользователя из хранилища
  useEffect(() => {
    if (isMounted) {
      try {
        // Пробуем получить данные из локального хранилища или из сессии
        const userData = localStorage.getItem('user_data');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setFormData(prev => ({
            ...prev,
            firstName: parsedUserData.firstName || parsedUserData.given_name || parsedUserData.first_name || '',
            lastName: parsedUserData.lastName || parsedUserData.family_name || parsedUserData.last_name || '',
            email: parsedUserData.email || '',
            phone: parsedUserData.phone || ''
          }));
        }
      } catch (error) {
        console.error('Failed to get user data:', error);
      }
    }
  }, [isMounted]);

  // Если корзина пуста, перенаправляем на страницу маркета
  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.push('/market');
    }
  }, [items, router, isMounted]);

  // Функция для форматирования цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Применяем форматирование для полей карты
    if (name === 'cardNumber') {
      setFormData(prev => ({ ...prev, [name]: formatCardNumber(value) }));
    } else if (name === 'cardExpiry') {
      setFormData(prev => ({ ...prev, [name]: formatCardExpiry(value) }));
    } else if (name === 'cardCvc') {
      // Ограничиваем CVC до 3-4 цифр
      const digitsOnly = value.replace(/\D/g, '').slice(0, 4);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else if (name === 'cardHolder') {
      // Переводим имя держателя карты в верхний регистр и разрешаем только буквы и пробелы
      const formattedValue = value.toUpperCase().replace(/[^A-Z\s]/g, '');
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Обработчик изменения способа оплаты
  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };
  
  // Обработчик применения промокода
  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoError('Введите промокод');
      return;
    }
    
    const success = applyPromoCode(promoCode);
    if (success) {
      setPromoError('');
      alert(`Промокод ${promoCode} успешно применен`);
    } else {
      setPromoError('Недействительный промокод или сумма заказа недостаточна');
    }
  };
  
  // Обработчик отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Имитация отправки заказа с задержкой
    setTimeout(() => {
      saveOrder({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          zip: formData.zip
        },
        payment: {
          method: formData.paymentMethod,
          // Храним только маскированные номера карт в целях безопасности
          cardLastFour: formData.cardNumber ? formData.cardNumber.replace(/\s/g, '').slice(-4) : null
        }
      });
      
      setIsLoading(false);
      
      // Показываем уведомление об успешном заказе
      alert('Заказ успешно оформлен!');
      
      // Перенаправляем на страницу успешного оформления заказа
      router.push('/dashboard/market');
    }, 1500);
  };
  
  if (!isMounted) return null;
  
  return (
    <PageWrapper title="Оформление заказа">
      <Container>
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {/* Кнопка возврата */}
          <Link href="/market" className="flex items-center text-primary mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к покупкам
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Форма оформления заказа */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Контактная информация */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">1. Контактная информация</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Имя *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Фамилия *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="+7 (___) ___-__-__"
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                {/* Адрес доставки */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">2. Адрес доставки</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Адрес *</Label>
                      <Textarea 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleInputChange} 
                        required 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Город *</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={formData.city} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">Индекс *</Label>
                        <Input 
                          id="zip" 
                          name="zip" 
                          value={formData.zip} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Способ оплаты */}
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h2 className="text-lg font-semibold mb-4">3. Способ оплаты</h2>
                  
                  <Tabs defaultValue="card" onValueChange={handlePaymentMethodChange}>
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Карта</span>
                      </TabsTrigger>
                      <TabsTrigger value="sbp" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span>СБП</span>
                      </TabsTrigger>
                      <TabsTrigger value="cash" className="flex items-center gap-2">
                        <Banknote className="w-4 h-4" />
                        <span>Наличные</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="card">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Номер карты *</Label>
                          <Input 
                            id="cardNumber" 
                            name="cardNumber" 
                            value={formData.cardNumber} 
                            onChange={handleInputChange} 
                            placeholder="0000 0000 0000 0000" 
                            maxLength={19} // 16 digits + 3 spaces
                            required={formData.paymentMethod === 'card'} 
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Срок действия *</Label>
                            <Input 
                              id="cardExpiry" 
                              name="cardExpiry" 
                              value={formData.cardExpiry} 
                              onChange={handleInputChange} 
                              placeholder="MM/YY" 
                              maxLength={5} // MM/YY format
                              required={formData.paymentMethod === 'card'} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvc">CVC *</Label>
                            <Input 
                              id="cardCvc" 
                              name="cardCvc"
                              type="password"  
                              value={formData.cardCvc} 
                              onChange={handleInputChange} 
                              placeholder="***" 
                              maxLength={4} // 3-4 digits
                              required={formData.paymentMethod === 'card'} 
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardHolder">Держатель карты *</Label>
                            <Input 
                              id="cardHolder" 
                              name="cardHolder" 
                              value={formData.cardHolder} 
                              onChange={handleInputChange} 
                              placeholder="IVAN IVANOV" 
                              required={formData.paymentMethod === 'card'} 
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="flex gap-2 items-center">
                            <Image 
                              src="/img/payment/visa.svg" 
                              alt="Visa" 
                              width={40} 
                              height={24} 
                            />
                            <Image 
                              src="/img/payment/mastercard.svg" 
                              alt="Mastercard" 
                              width={40} 
                              height={24} 
                            />
                            <Image 
                              src="/img/payment/mir.svg" 
                              alt="MIR" 
                              width={40} 
                              height={24} 
                            />
                          </div>
                          <div className="ml-auto flex items-center text-sm text-gray-500">
                            <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
                            Безопасная оплата
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sbp">
                      <div className="text-center py-8">
                        <Image 
                          src="/img/payment/sbp.svg" 
                          alt="СБП" 
                          width={100} 
                          height={60}
                          className="mx-auto mb-4" 
                        />
                        <p className="text-sm text-gray-600">
                          После оформления заказа, вы получите QR-код для оплаты через Систему Быстрых Платежей.
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="cash">
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <Banknote className="w-8 h-8 text-primary mr-4" />
                        <div>
                          <h3 className="font-medium">Оплата наличными</h3>
                          <p className="text-sm text-gray-600">Оплата при получении наличными или картой курьеру</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Кнопка отправки заказа (только на мобильных) */}
                <div className="lg:hidden">
                  <Button 
                    type="submit" 
                    className="w-full py-6 text-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Обработка заказа...' : `Оплатить ${formatPrice(total)}`}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Сводка заказа */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Ваш заказ</h2>
                
                {/* Список товаров */}
                <div className="max-h-[300px] overflow-y-auto mb-4">
                  {items.map(item => (
                    <div key={item.slug} className="flex items-center py-3 border-b">
                      {item.image && (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md mr-3">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.title}</h3>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500">
                            {item.maxQuantity !== undefined 
                              ? `${item.quantity} x ${typeof item.price === 'string' ? item.price : formatPrice(item.price)}`
                              : typeof item.price === 'string' ? item.price : formatPrice(item.price)}
                          </span>
                          <span className="text-sm font-semibold">
                            {typeof item.price === 'string' 
                              ? item.price 
                              : formatPrice(typeof item.price === 'number' ? (item.maxQuantity !== undefined ? item.price * item.quantity : item.price) : 0)
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Промокод */}
                <div className="mb-4 pb-4 border-b">
                  <Label htmlFor="promo" className="mb-1 block">Промокод</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="promo" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Введите промокод"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleApplyPromoCode}
                    >
                      Применить
                    </Button>
                  </div>
                  {promoError && <p className="text-red-500 text-sm mt-1">{promoError}</p>}
                  {activePromoCode && (
                    <div className="flex justify-between items-center mt-2 text-sm">
                      <span className="flex items-center text-green-600">
                        Промокод {activePromoCode} активен
                      </span>
                      <button 
                        onClick={clearPromoCode}
                        className="text-red-500 hover:underline"
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Сводка цен */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span>Подытог:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Скидка:</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Итого:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                
                {/* Преимущества */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm">
                    <Truck className="w-4 h-4 mr-2 text-primary" />
                    <span>Бесплатная доставка при заказе от 5 000 ₽</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                    <span>Гарантия безопасной оплаты</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>Доставка по всей России</span>
                  </div>
                </div>
                
                {/* Кнопка отправки заказа (для десктопа) */}
                <div className="hidden lg:block">
                  <Button 
                    type="submit"
                    onClick={handleSubmit}
                    className="w-full py-6 text-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Обработка заказа...' : `Оплатить ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
} 