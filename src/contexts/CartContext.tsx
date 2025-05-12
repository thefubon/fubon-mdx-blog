'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  slug: string;
  title: string;
  price: number | string;
  image?: string;
  quantity: number;
  maxQuantity?: number; // Maximum quantity allowed to purchase
}

interface Discount {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
}

// Types for order handling
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  zip: string;
}

export interface PaymentInfo {
  method: string;
  cardLastFour: string | null;
}

export interface OrderData {
  customer: CustomerInfo;
  shipping: ShippingInfo;
  payment: PaymentInfo;
  [key: string]: unknown;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode: string | null;
  customer: CustomerInfo;
  shipping: ShippingInfo;
  payment: PaymentInfo;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (slug: string) => void;
  updateItemQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (slug: string) => boolean;
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  discount: number;
  total: number;
  applyPromoCode: (code: string) => boolean;
  activePromoCode: string | null;
  clearPromoCode: () => void;
  saveOrder: (orderData: OrderData) => void;
  orderHistory: Order[];
}

// Образцовые промокоды для демонстрации
const PROMO_CODES: Discount[] = [
  { code: 'WELCOME10', type: 'percentage', value: 10 },
  { code: 'SALE25', type: 'percentage', value: 25, minAmount: 5000 },
  { code: 'FREEBIE', type: 'fixed', value: 1000, minAmount: 10000 },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [activePromoCode, setActivePromoCode] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // Расчет стоимости
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = typeof item.price === 'number' 
      ? item.price 
      : parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  // Расчет скидки на основе активного промокода
  const calculateDiscount = () => {
    if (!activePromoCode) return 0;
    
    const promoCode = PROMO_CODES.find(p => p.code === activePromoCode);
    if (!promoCode) return 0;
    
    // Проверка минимальной суммы заказа
    if (promoCode.minAmount && subtotal < promoCode.minAmount) return 0;
    
    if (promoCode.type === 'percentage') {
      return subtotal * (promoCode.value / 100);
    } else {
      return Math.min(promoCode.value, subtotal); // Не больше суммы заказа
    }
  };
  
  const discount = calculateDiscount();
  const total = Math.max(0, subtotal - discount);

  // Загрузка корзины и истории заказов из localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('market_cart');
    const savedPromoCode = localStorage.getItem('market_promo_code');
    const savedOrders = localStorage.getItem('market_order_history');
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        updateCartTotals(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    
    if (savedPromoCode) {
      setActivePromoCode(savedPromoCode);
    }
    
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrderHistory(parsedOrders);
      } catch (error) {
        console.error('Failed to parse order history from localStorage:', error);
      }
    }
  }, []);
  
  // Обновление счетчиков корзины
  const updateCartTotals = (currentItems: CartItem[]) => {
    setItemCount(currentItems.length);
    setTotalQuantity(currentItems.reduce((total, item) => total + item.quantity, 0));
  };

  // Сохранение корзины в localStorage
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('market_cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('market_cart');
      // При очистке корзины также убираем промокод
      clearPromoCode();
    }
    
    updateCartTotals(items);
  }, [items]);
  
  // Сохранение промокода в localStorage
  useEffect(() => {
    if (activePromoCode) {
      localStorage.setItem('market_promo_code', activePromoCode);
    } else {
      localStorage.removeItem('market_promo_code');
    }
  }, [activePromoCode]);
  
  // Сохранение истории заказов в localStorage
  useEffect(() => {
    if (orderHistory.length > 0) {
      localStorage.setItem('market_order_history', JSON.stringify(orderHistory));
    }
  }, [orderHistory]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      // Проверяем, есть ли уже этот товар в корзине
      const existingItem = prevItems.find(i => i.slug === item.slug);
      
      if (existingItem) {
        // Если товар уже в корзине, увеличиваем его количество
        return prevItems.map(i => 
          i.slug === item.slug 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      
      // Если товара нет в корзине, добавляем его с количеством 1
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (slug: string) => {
    setItems(prevItems => prevItems.filter(item => item.slug !== slug));
  };
  
  const updateItemQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(slug);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.slug === slug 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('market_cart');
  };

  const isInCart = (slug: string) => {
    return items.some(item => item.slug === slug);
  };
  
  const applyPromoCode = (code: string): boolean => {
    const promoCode = PROMO_CODES.find(
      p => p.code.toLowerCase() === code.toLowerCase()
    );
    
    if (!promoCode) return false;
    
    // Проверка минимальной суммы заказа
    if (promoCode.minAmount && subtotal < promoCode.minAmount) {
      return false;
    }
    
    setActivePromoCode(promoCode.code);
    return true;
  };
  
  const clearPromoCode = () => {
    setActivePromoCode(null);
  };
  
  const saveOrder = (orderData: OrderData) => {
    const newOrder: Order = {
      id: `ORDER-${Date.now()}`,
      date: new Date().toISOString(),
      items: [...items],
      subtotal,
      discount,
      total,
      promoCode: activePromoCode,
      ...orderData,
    };
    
    setOrderHistory(prev => [newOrder, ...prev]);
    clearCart();
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateItemQuantity,
      clearCart, 
      isInCart, 
      itemCount,
      totalQuantity,
      subtotal,
      discount,
      total,
      applyPromoCode,
      activePromoCode,
      clearPromoCode,
      saveOrder,
      orderHistory
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 