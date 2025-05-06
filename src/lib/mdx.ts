import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { Post, PostMetadata, PaginationResult } from './types';

const contentDirectory = path.join(process.cwd(), 'src/content');

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

  let publishedAt = new Date().toISOString();
  if (data.publishedAt) {
    if (typeof data.publishedAt === 'string') {
      publishedAt = data.publishedAt;
    }
    else if (data.publishedAt instanceof Date) {
      publishedAt = data.publishedAt.toISOString();
    }
    else {
      publishedAt = new Date(data.publishedAt).toISOString();
    }
  }

  let tags = data.tags;
  if (typeof tags === 'string') {
    tags = tags.split(',').map((tag: string) => tag.trim());
  }

  const frontmatter: PostMetadata = {
    title: data.title || 'Без заголовка',
    publishedAt: publishedAt,
    description: data.description,
    slug: slug,
    readingTime: readingTime(content).text,
    tags: tags,
    category: data.category,
    ...Object.entries(data)
      .filter(([key]) => !['title', 'publishedAt', 'description', 'tags', 'category'].includes(key))
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

export function getPaginatedPosts(page: number = 1, limit: number = 5, excludeSlugs: string[] = []): PaginationResult {
  const allPosts = getAllPosts().filter(post => !excludeSlugs.includes(post.frontmatter.slug));
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalPosts);

  const posts = allPosts.slice(startIndex, endIndex);

  return {
    posts,
    totalPages: totalPages || 1,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

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

export function getPostsByTag(tag: string, page: number = 1, limit: number = 5): PaginationResult {
  const postsWithTag = getAllPosts().filter(post => {
    const postTags = post.frontmatter.tags || [];
    return postTags.includes(tag);
  });

  const totalPosts = postsWithTag.length;
  const totalPages = Math.ceil(totalPosts / limit) || 1;
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

export function searchPosts(query: string, page: number = 1, limit: number = 5): PaginationResult {
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
  const totalPages = Math.ceil(totalPosts / limit) || 1;
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

export function getRelatedPosts(slug: string, tags: string[] = [], limit: number = 3): Post[] {
  const allPosts = getAllPosts();
  const otherPosts = allPosts.filter((post) => post.frontmatter.slug !== slug);

  if (!tags || tags.length === 0) {
    return shuffleArray(otherPosts).slice(0, limit);
  }

  const relatedPosts = otherPosts.map((post) => {
    const postTags = post.frontmatter.tags || [];
    const commonTags = postTags.filter((tag) => tags.includes(tag));
    return {
      ...post,
      relevance: commonTags.length,
    };
  }) as PostWithRelevance[];

  return relatedPosts
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}

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

  return Object.keys(archive)
    .sort((a, b) => parseInt(b) - parseInt(a))
    .reduce((sortedArchive, year) => {
      sortedArchive[year] = archive[year];
      return sortedArchive;
    }, {} as Record<string, Record<string, Post[]>>);
}

// Новые функции для работы с категориями
export function getAllCategories(): { category: string; count: number }[] {
  const posts = getAllPosts();
  const categoriesWithCount: Record<string, number> = {};

  posts.forEach(post => {
    const category = post.frontmatter.category || 'Без категории';
    categoriesWithCount[category] = (categoriesWithCount[category] || 0) + 1;
  });

  return Object.entries(categoriesWithCount)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export function getPostsByCategory(category: string, page: number = 1, limit: number = 5): PaginationResult {
  const postsInCategory = getAllPosts().filter(post => {
    const postCategory = post.frontmatter.category || 'Без категории';
    return postCategory === category;
  });

  const totalPosts = postsInCategory.length;
  const totalPages = Math.ceil(totalPosts / limit) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalPosts);

  const posts = postsInCategory.slice(startIndex, endIndex);

  return {
    posts,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}