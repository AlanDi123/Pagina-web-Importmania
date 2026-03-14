import type { BlogPost } from '@prisma/client';

/**
 * Post de blog para listar
 */
export interface BlogPostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  authorName: string;
  isPublished: boolean;
  publishedAt: Date | null;
  viewCount: number;
  tags: string[];
  createdAt: Date;
  readingTime: number; // minutos
}

/**
 * Post de blog completo para mostrar
 */
export interface BlogPostDetail extends BlogPost {
  readingTime: number;
  relatedPosts: BlogPostListItem[];
  previousPost: BlogPostListItem | null;
  nextPost: BlogPostListItem | null;
}

/**
 * Post de blog para admin
 */
export interface BlogPostAdmin {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  authorName: string;
  isPublished: boolean;
  publishedAt: Date | null;
  viewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Datos para crear/editar post
 */
export interface BlogPostFormData {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  coverImage?: string | null;
  authorName?: string;
  isPublished: boolean;
  publishedAt?: Date | null;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
}

/**
 * Filtros para blog
 */
export interface BlogFilters {
  tag?: string;
  author?: string;
  year?: number;
  month?: number;
  search?: string;
  isPublished?: boolean;
}

/**
 * Estadísticas de blog
 */
export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  scheduledPosts: number;
  totalViews: number;
  averageViewsPerPost: number;
  mostViewedPosts: BlogPostListItem[];
  recentPosts: BlogPostAdmin[];
  topTags: Array<{ tag: string; count: number }>;
  viewsByMonth: Array<{ month: string; views: number }>;
}

/**
 * Archivo de blog por fecha
 */
export interface BlogArchive {
  year: number;
  month: number;
  monthName: string;
  postCount: number;
  posts: BlogPostListItem[];
}

/**
 * Autor de blog
 */
export interface BlogAuthor {
  name: string;
  avatar?: string;
  bio?: string;
  postCount: number;
  posts: BlogPostListItem[];
}

/**
 * Índice de contenidos para post largo
 */
export interface TableOfContents {
  heading: string;
  level: number;
  id: string;
  children?: TableOfContents[];
}

/**
 * Post relacionado por tags
 */
export interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  relevanceScore: number;
}

export default {
  type BlogPostListItem,
  type BlogPostDetail,
  type BlogPostAdmin,
  type BlogPostFormData,
  type BlogFilters,
  type BlogStats,
  type BlogArchive,
  type BlogAuthor,
  type TableOfContents,
  type RelatedPost,
};
