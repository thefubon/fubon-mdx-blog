'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

// Кастомный хук для дебаунса
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface SearchFormProps {
  initialSearchValue?: string;
}

export default function SearchForm({ initialSearchValue = '' }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchValue);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  
  // Используем дебаунс для поискового запроса
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Эффект для обновления URL при изменении дебаунсированного значения
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3 || debouncedSearchTerm.length === 0) {
      startTransition(() => {
        // Обновляем URL с параметром поиска, сохраняя другие параметры
        const params = new URLSearchParams(window.location.search);
        
        if (debouncedSearchTerm.length >= 3) {
          params.set('search', debouncedSearchTerm);
        } else {
          params.delete('search');
        }
        
        const newUrl = `${pathname}?${params.toString()}`;
        router.push(newUrl);
      });
    }
  }, [debouncedSearchTerm, pathname, router]);

  // Обработчик изменения ввода
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative flex-grow">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isPending ? 'text-primary animate-pulse' : 'text-gray-400'} w-5 h-5`} />
      <input 
        type="text"
        name="search"
        placeholder="Введите минимум 3 символа для поиска..."
        value={searchTerm}
        onChange={handleInputChange}
        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
} 