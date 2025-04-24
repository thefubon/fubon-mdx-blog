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

  // Убеждаемся, что обязательные поля существуют
  const frontmatter: PostMetadata = {
    title: data.title || 'Без заголовка', // Значение по умолчанию для title
    publishedAt: publishedAt,
    description: data.description, // Опциональное поле может быть undefined
    slug: slug,
    readingTime: readingTime(content).text,
    tags: data.tags, // Опциональное поле для тегов
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

// Добавим функцию для пагинации записей блога
export function getPaginatedPosts(page: number = 1, postsPerPage: number = 5) {
  const allPosts = getAllPosts();
  const startIndex = (page - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const posts = allPosts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  return {
    posts,
    totalPages,
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

// Вспомогательная функция для перемешивания массива
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
