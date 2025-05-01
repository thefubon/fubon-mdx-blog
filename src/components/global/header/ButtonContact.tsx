import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonAnimationProps = {
  href?: string
  variant?: 'default' | 'primary' | 'secondary'
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>

export default function ButtonContact({
  href,
  className,
  children = 'Email',
  variant = 'default',
  ...props
}: ButtonAnimationProps) {
  // Базовые классы для кнопки
  const buttonClasses = cn(
    // Основные стили кнопки с CSS переменными
    'group animation-trigger relative z-10 cursor-pointer overflow-hidden flex items-center rounded-full bg-foreground text-background uppercase transition-colors duration-300 hover:bg-secondary md:flex',
    // CSS переменные применяются через стили inline
    'h-[var(--button-height)] px-[var(--button-padding-x)]',
    // Варианты цветов
    {
      'bg-foreground hover:bg-fubon-primary text-background':
        variant === 'default' || variant === 'secondary',
      'bg-fubon-primary hover:bg-foreground text-background':
        variant === 'primary',
    },
    // Пользовательские классы
    className
  )

  return (
    <button
      className={buttonClasses}
      {...props}>
      {href && (
        <Link
          href={href}
          aria-label={typeof children === 'string' ? children : 'Заказать'}
          className="absolute inset-0 z-10"></Link>
      )}

      <div className="button-animation relative flex items-center gap-x-3.5">
        <span className="absolute -left-full transition-all duration-300 ease-in-out group-hover:-left-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 16 16"
            className="w-5 h-5">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M2.343 8h11.314m0 0-4.984 4.984M13.657 8 8.673 3.016"></path>
          </svg>
        </span>

        <span className="transition-transform relative inline-block whitespace-nowrap duration-300 group-hover:translate-x-5">
          {children}
        </span>

        <span className="scale-100 h-1.5 w-1.5 rounded-full bg-background transition-transform duration-200 group-hover:scale-0"></span>
      </div>
    </button>
  )
}
