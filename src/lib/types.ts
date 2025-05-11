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
  grid?: {
    col?: number;
    row?: number;
  };
  catGrid?: {
    col?: number;
    row?: number;
  };
  price?: number | string;
  images?: string[];
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