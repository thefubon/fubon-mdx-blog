'use client'

import { useState } from 'react'
import BlogFilters from '@/components/blog/BlogFilters'
import BlogPostGrid from '@/components/blog/BlogPostGrid'
import type { Post } from '@/lib/types'
import { SortMode } from '@/components/blog/BlogFilters'
import { filterPosts } from '@/lib/blog-client'
import { getSavedSortMode, saveSortMode } from '@/lib/client-utils'

interface BlogComponentsProps {
  posts: Post[]
}

// Клиентский компонент для синхронизации между BlogFilters и BlogPostGrid
export default function BlogComponents({ posts }: BlogComponentsProps) {
  // Получаем сохраненный режим сортировки
  const initialSortMode = getSavedSortMode();
  
  // Предварительно фильтруем посты в соответствии с сохраненным режимом сортировки
  const getFilteredPosts = (sortMode: SortMode, allPosts: Post[]) => {
    const sortBy = sortMode === 'popular' ? 'popular' : 'date';
    return filterPosts(allPosts, { sortBy });
  };
  
  // Предварительно фильтрованные посты
  const initialFilteredPosts = getFilteredPosts(initialSortMode, posts);
  
  // Инициализируем состояние
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialFilteredPosts);
  
  // Обработчик изменения режима сортировки
  const handleSortChange = (mode: SortMode) => {
    // Сохраняем режим сортировки в localStorage
    saveSortMode(mode);
    
    // Фильтруем посты на клиенте
    const filtered = getFilteredPosts(mode, posts);
    setFilteredPosts(filtered);
  };
  
  return (
    <>
      <BlogFilters 
        onSortChange={handleSortChange}
      />
      <BlogPostGrid 
        posts={filteredPosts} 
        onFilteredCountChange={(count) => {
          // Используем обратный вызов для передачи счетчика вверх, если нужно
          console.log(`Отфильтровано ${count} постов`);
        }}
      />
    </>
  )
} 