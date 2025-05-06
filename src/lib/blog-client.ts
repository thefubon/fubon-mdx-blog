'use client';

import { Post } from './types';

// Эта функция симулирует серверный запрос, но фактически работает с переданными данными
export function filterPosts(posts: Post[], options: { 
  sortBy?: 'date' | 'popular',
  category?: string, 
  tag?: string,
  page?: number,
  limit?: number,
  excludeSlugs?: string[]
}): Post[] {
  let filteredPosts = [...posts];
  const { sortBy = 'date', category, tag, excludeSlugs = [] } = options;
  
  // Фильтрация по исключенным слагам
  if (excludeSlugs.length > 0) {
    filteredPosts = filteredPosts.filter(post => !excludeSlugs.includes(post.frontmatter.slug));
  }
  
  // Фильтрация по категории
  if (category) {
    filteredPosts = filteredPosts.filter(post => {
      const postCategory = post.frontmatter.category || 'Без категории';
      return postCategory === category;
    });
  }
  
  // Фильтрация по тегу
  if (tag) {
    filteredPosts = filteredPosts.filter(post => {
      const postTags = post.frontmatter.tags || [];
      return postTags.includes(tag);
    });
  }
  
  // Сортировка
  if (sortBy === 'date') {
    filteredPosts.sort((a, b) => 
      new Date(b.frontmatter.publishedAt).getTime() - 
      new Date(a.frontmatter.publishedAt).getTime()
    );
  } else if (sortBy === 'popular') {
    // Отображать только избранные посты, сортированные по дате
    filteredPosts = filteredPosts
      .filter(post => post.frontmatter.favorite)
      .sort((a, b) => 
        new Date(b.frontmatter.publishedAt).getTime() - 
        new Date(a.frontmatter.publishedAt).getTime()
      );
  }
  
  return filteredPosts;
}

// Интерфейс для поста с добавленной релевантностью
interface PostWithRelevance extends Post {
  relevance: number;
}

// Функция для получения связанных постов
export function getRelatedPostsClient(posts: Post[], currentSlug: string, tags: string[] = [], limit: number = 3): Post[] {
  // Исключаем текущий пост
  const otherPosts = posts.filter(post => post.frontmatter.slug !== currentSlug);
  
  if (!tags || tags.length === 0) {
    // Если нет тегов, возвращаем случайные посты
    return shuffleArray(otherPosts).slice(0, limit);
  }
  
  // Находим посты с общими тегами
  const postsWithRelevance = otherPosts.map(post => {
    const postTags = post.frontmatter.tags || [];
    const commonTags = postTags.filter(tag => tags.includes(tag));
    return {
      ...post,
      relevance: commonTags.length
    } as PostWithRelevance;
  });
  
  // Сортируем по релевантности (количеству общих тегов)
  return postsWithRelevance
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

// Вспомогательная функция для перемешивания массива
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
} 