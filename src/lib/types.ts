export interface PostMetadata {
  title: string;
  publishedAt: string;
  description?: string;
  slug: string;
  readingTime: string;
  tags?: string[];
  category?: string;
  cover?: string;
  favorite?: boolean;
}

export interface Post {
  frontmatter: PostMetadata;
  content: string;
}

export interface PaginationResult {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
} 