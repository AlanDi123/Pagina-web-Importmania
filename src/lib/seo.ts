import { Metadata } from 'next';
import { APP_NAME, APP_DESCRIPTION, APP_URL, BRAND_COLORS } from '@/lib/constants';

/**
 * Genera metadata base para la aplicación
 */
export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: APP_NAME,
      template: `%s | ${APP_NAME}`,
    },
    description: APP_DESCRIPTION,
    keywords: [
      'productos importados',
      'tienda online',
      'Argentina',
      'e-commerce',
      'compras online',
    ],
    authors: [{ name: APP_NAME }],
    creator: APP_NAME,
    publisher: APP_NAME,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'es_AR',
      url: APP_URL,
      siteName: APP_NAME,
      title: APP_NAME,
      description: APP_DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title: APP_NAME,
      description: APP_DESCRIPTION,
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
  };
}

/**
 * Genera metadata para página de producto
 */
export function generateProductMetadata(product: {
  name: string;
  description: string;
  price: number;
  currency?: string;
  availability?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  sku?: string;
}): Metadata {
  const title = `${product.name} | ${APP_NAME}`;
  const description = product.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'product',
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

/**
 * Genera metadata para categoría
 */
export function generateCategoryMetadata(category: {
  name: string;
  description?: string;
  image?: string;
}): Metadata {
  const title = `${category.name} | ${APP_NAME}`;
  const description = category.description || `Comprá ${category.name} en ${APP_NAME}. Envíos a todo el país.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'product.group',
      images: category.image ? [{ url: category.image, alt: category.name }] : undefined,
    },
  };
}

/**
 * Genera metadata para blog post
 */
export function generateBlogPostMetadata(post: {
  title: string;
  excerpt?: string;
  coverImage?: string;
  authorName?: string;
  publishedAt?: Date;
  tags?: string[];
}): Metadata {
  const title = `${post.title} | Blog | ${APP_NAME}`;
  const description = post.excerpt || post.title.slice(0, 160);

  return {
    title,
    description,
    authors: post.authorName ? [{ name: post.authorName }] : undefined,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.authorName ? [post.authorName] : undefined,
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

/**
 * Genera structured data (JSON-LD) para producto
 */
export function generateProductStructuredData(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  availability?: string;
  image?: string | string[];
  rating?: number;
  reviewCount?: number;
  sku?: string;
  brand?: string;
  url?: string;
}) {
  const baseUrl = product.url || `${APP_URL}/productos/${product.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: Array.isArray(product.image) ? product.image : product.image ? [product.image] : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'ARS',
      availability: product.availability || 'https://schema.org/InStock',
      url: baseUrl,
    },
    sku: product.sku,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand,
    } : undefined,
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  };
}

/**
 * Genera structured data para organización
 */
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: APP_NAME,
    url: APP_URL,
    logo: `${APP_URL}/logo.png`,
    description: APP_DESCRIPTION,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Spanish',
    },
    sameAs: [
      'https://www.instagram.com/importmania',
      'https://www.tiktok.com/@importmania',
      'https://www.facebook.com/importmania',
    ],
  };
}

/**
 * Genera structured data para website
 */
export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: APP_NAME,
    url: APP_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${APP_URL}/buscar?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Genera structured data para breadcrumbs
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{
  name: string;
  url: string;
  position: number;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb) => ({
      '@type': 'ListItem',
      position: crumb.position,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

/**
 * Genera structured data para artículo de blog
 */
export function generateArticleStructuredData(article: {
  headline: string;
  description: string;
  image?: string;
  author?: string;
  datePublished?: Date;
  dateModified?: Date;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    author: article.author ? {
      '@type': 'Person',
      name: article.author,
    } : undefined,
    datePublished: article.datePublished?.toISOString(),
    dateModified: article.dateModified?.toISOString(),
    url: article.url,
    publisher: {
      '@type': 'Organization',
      name: APP_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${APP_URL}/logo.png`,
      },
    },
  };
}

/**
 * Genera structured data para FAQ
 */
export function generateFAQStructuredData(faqs: Array<{
  question: string;
  answer: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Genera structured data para reviews
 */
export function generateReviewStructuredData(review: {
  rating: number;
  bestRating?: number;
  worstRating?: number;
  author?: string;
  datePublished?: Date;
  reviewBody?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: APP_NAME,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: review.bestRating || 5,
      worstRating: review.worstRating || 1,
    },
    author: review.author ? {
      '@type': 'Person',
      name: review.author,
    } : undefined,
    datePublished: review.datePublished?.toISOString(),
    reviewBody: review.reviewBody,
  };
}

/**
 * Helper para inyectar structured data en el HTML
 */
export function renderStructuredData<T>(data: T): string {
  return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
}

export default {
  generateBaseMetadata,
  generateProductMetadata,
  generateCategoryMetadata,
  generateBlogPostMetadata,
  generateProductStructuredData,
  generateOrganizationStructuredData,
  generateWebSiteStructuredData,
  generateBreadcrumbStructuredData,
  generateArticleStructuredData,
  generateFAQStructuredData,
  generateReviewStructuredData,
  renderStructuredData,
};
