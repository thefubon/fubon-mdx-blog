import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const contentDirectory = path.join(process.cwd(), 'src/content');

// Расширяем интерфейс, чтобы включить все возможные поля из frontmatter
export interface PostMetadata {
  title: string;
  publishedAt: string;
  description?: string;
  slug: string;
  readingTime: string;
  tags?: string[];
}

// Определяем типы для результатов функций
export interface Post {
  frontmatter: PostMetadata;
  content: string;
}

// Интерфейс для постов с оценкой релевантности
interface PostWithRelevance extends Post {
  relevance: number;
}

// Интерфейс для результатов пагинации
export interface PaginationResult {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function getAllPostSlugs() {
  const files = fs.readdirSync(path.join(contentDirectory, 'blog'));
  return files
    .filter(file => file.endsWith('.mdx'))
    .map(file => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(contentDirectory, 'blog', `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  // Обработка даты публикации в зависимости от типа
  let publishedAt = new Date().toISOString();

  if (data.publishedAt) {
    // Если дата уже является строкой в формате ISO, используем её
    if (typeof data.publishedAt === 'string') {
      publishedAt = data.publishedAt;
    }
    // Если дата является объектом Date, преобразуем в ISO строку
    else if (data.publishedAt instanceof Date) {
      publishedAt = data.publishedAt.toISOString();
    }
    // Если дата в другом формате, пытаемся преобразовать
    else {
      publishedAt = new Date(data.publishedAt).toISOString();
    }
  }

  // Если теги пришли как строка, превращаем их в массив
  let tags = data.tags;
  if (typeof tags === 'string') {
    tags = tags.split(',').map((tag: string) => tag.trim());
  }

  // Убеждаемся, что обязательные поля существуют
  const frontmatter: PostMetadata = {
    title: data.title || 'Без заголовка', // Значение по умолчанию для title
    publishedAt: publishedAt,
    description: data.description, // Опциональное поле может быть undefined
    slug: slug,
    readingTime: readingTime(content).text,
    tags: tags, // Обработанные теги
    // Включаем все остальные поля из frontmatter
    ...Object.entries(data)
      .filter(([key]) => !['title', 'publishedAt', 'description', 'tags'].includes(key))
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
  };

  return {
    frontmatter,
    content,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  const posts = slugs.map(slug => getPostBySlug(slug))
    .sort((a, b) => new Date(b.frontmatter.publishedAt).getTime() - new Date(a.frontmatter.publishedAt).getTime());

  return posts;
}

// Улучшенная функция для пагинации записей блога
export function getPaginatedPosts(page: number = 1, limit: number = 5): PaginationResult {
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;

  // Убедимся, что страница начинается с 1 и не превышает максимальное количество страниц
  const totalPages = Math.ceil(totalPosts / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1)); // Используем 1, если totalPages равно 0

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalPosts);

  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPages: totalPages || 1, // Минимум 1 страница
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

// Функция для получения всех уникальных тегов
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagsWithCount: Record<string, number> = {};

  posts.forEach(post => {
    const postTags = post.frontmatter.tags || [];
    postTags.forEach(tag => {
      tagsWithCount[tag] = (tagsWithCount[tag] || 0) + 1;
    });
  });

  return Object.entries(tagsWithCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

// Функция для получения постов по тегу с пагинацией
export function getPostsByTag(tag: string, page: number = 1, limit: number = 5): PaginationResult {
  // Получаем все посты с указанным тегом
  const postsWithTag = getAllPosts().filter(post => {
    const postTags = post.frontmatter.tags || [];
    return postTags.includes(tag);
  });

  const totalPosts = postsWithTag.length;

  // Убедимся, что страница начинается с 1 и не превышает максимальное количество страниц
  const totalPages = Math.ceil(totalPosts / limit) || 1; // Минимум 1 страница, даже если постов нет
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalPosts);

  const posts = postsWithTag.slice(startIndex, endIndex);

  return {
    posts,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

// Функция для поиска постов с пагинацией
export function searchPosts(query: string, page: number = 1, limit: number = 5): PaginationResult {
  // Если запрос пустой, возвращаем пустой результат с одной страницей
  if (!query || query.trim() === '') {
    return {
      posts: [],
      totalPages: 1,
      currentPage: 1,
      hasNextPage: false,
      hasPrevPage: false
    };
  }

  const searchQuery = query.toLowerCase().trim();

  // Фильтруем посты, содержащие поисковый запрос
  const matchingPosts = getAllPosts().filter(post => {
    const { title, description } = post.frontmatter;
    const searchableContent = [
      title.toLowerCase(),
      (description || '').toLowerCase(),
      post.content.toLowerCase()
    ].join(' ');

    return searchableContent.includes(searchQuery);
  });

  const totalPosts = matchingPosts.length;

  // Убедимся, что страница начинается с 1 и не превышает максимальное количество страниц
  const totalPages = Math.ceil(totalPosts / limit) || 1; // Минимум 1 страница, даже если постов нет
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalPosts);

  const posts = matchingPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

// Добавим функцию для получения похожих постов
export function getRelatedPosts(slug: string, tags: string[] = [], limit: number = 3): Post[] {
  const allPosts = getAllPosts();

  // Исключаем текущий пост
  const otherPosts = allPosts.filter((post) => post.frontmatter.slug !== slug);

  // Если нет тегов, возвращаем случайные посты
  if (!tags || tags.length === 0) {
    return shuffleArray(otherPosts).slice(0, limit);
  }

  // Ранжируем посты по количеству совпадающих тегов
  const relatedPosts = otherPosts.map((post) => {
    const postTags = post.frontmatter.tags || [];
    const commonTags = postTags.filter((tag) => tags.includes(tag));
    return {
      ...post,
      relevance: commonTags.length,
    };
  }) as PostWithRelevance[];

  // Сортируем по релевантности и возвращаем лимит
  return relatedPosts
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

// Функция для получения архива постов по годам и месяцам
export function getPostsArchive(): Record<string, Record<string, Post[]>> {
  const posts = getAllPosts();
  const archive: Record<string, Record<string, Post[]>> = {};

  posts.forEach(post => {
    const date = new Date(post.frontmatter.publishedAt);
    const year = date.getFullYear().toString();
    const month = date.toLocaleString('ru-RU', { month: 'long' });

    if (!archive[year]) {
      archive[year] = {};
    }

    if (!archive[year][month]) {
      archive[year][month] = [];
    }

    archive[year][month].push(post);
  });

  // Сортируем годы и месяцы в обратном порядке (от новых к старым)
  return Object.keys(archive)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .reduce((sortedArchive, year) => {
      sortedArchive[year] = archive[year];
      return sortedArchive;
    }, {} as Record<string, Record<string, Post[]>>);
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
