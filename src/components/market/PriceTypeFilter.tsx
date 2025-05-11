'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface PriceTypeFilterProps {
  initialValue?: boolean;
}

export default function PriceTypeFilter({ initialValue = false }: PriceTypeFilterProps) {
  const [showOnlyFree, setShowOnlyFree] = useState<boolean>(initialValue);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Обработчик изменения переключателя
  const handleSwitchChange = (checked: boolean) => {
    setShowOnlyFree(checked);
    
    // Создаем новый объект URLSearchParams на основе текущих параметров
    const params = new URLSearchParams(searchParams.toString());
    
    // Если checked=true, показываем только бесплатные (isPaid=false)
    // Если checked=false, показываем все товары (параметр isPaid отсутствует)
    if (checked) {
      params.set('isPaid', 'false');
    } else {
      params.delete('isPaid');
    }
    
    // Перенаправляем на новый URL с обновленными параметрами
    router.push(`/market?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
      <Label 
        htmlFor="price-filter"
        className={`text-sm font-medium cursor-pointer select-none ${!showOnlyFree ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
      >
        ВСЕ
      </Label>
      <Switch 
        id="price-filter"
        checked={showOnlyFree}
        onCheckedChange={handleSwitchChange}
      />
      <Label 
        htmlFor="price-filter"
        className={`text-sm font-medium cursor-pointer select-none ${showOnlyFree ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}
      >
        Бесплатные
      </Label>
    </div>
  );
} 