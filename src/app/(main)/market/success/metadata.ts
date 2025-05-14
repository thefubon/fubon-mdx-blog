import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Успешная покупка',
  description: 'Спасибо за ваш заказ! Информация о вашей покупке и следующих шагах.',
  openGraph: {
    title: 'Успешная покупка',
    description: 'Спасибо за ваш заказ! Информация о вашей покупке и следующих шагах.',
    images: [
      {
        url: '/img/og/success.jpg',
        width: 1200,
        height: 630,
        alt: 'Успешная покупка',
      },
    ],
  },
}; 