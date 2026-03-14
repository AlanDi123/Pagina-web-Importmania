import type { Review, Product, User } from '@prisma/client';

/**
 * Reseña con información completa
 */
export interface ReviewWithRelations extends Review {
  user: Pick<User, 'id' | 'name' | 'avatar'>;
  product?: Pick<Product, 'id' | 'name' | 'slug' | 'mainImage'>;
}

/**
 * Reseña para mostrar en producto
 */
export interface ReviewDisplay {
  id: string;
  userId: string;
  userName: string | null;
  userAvatar: string | null;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
  helpful: number;
  notHelpful: number;
  productImages: string[];
}

/**
 * Reseña para listar en admin
 */
export interface ReviewListItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
}

/**
 * Resumen de reseñas para producto
 */
export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recommendedPercentage: number;
  verifiedPurchasesCount: number;
  withPhotosCount: number;
  recentReviews: ReviewDisplay[];
}

/**
 * Datos para crear reseña
 */
export interface ReviewFormData {
  productId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  wouldRecommend?: boolean;
  images?: string[];
}

/**
 * Filtros para reseñas
 */
export interface ReviewFilters {
  rating?: number;
  isVerified?: boolean;
  isApproved?: boolean;
  withPhotos?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  productId?: string;
  userId?: string;
}

/**
 * Estadísticas de reseñas
 */
export interface ReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  averageRating: number;
  verifiedPurchasesCount: number;
  reviewsWithPhotos: number;
  reviewsByRating: Record<number, number>;
  recentReviews: ReviewListItem[];
  topReviewedProducts: Array<{
    productId: string;
    productName: string;
    reviewCount: number;
    averageRating: number;
  }>;
}

/**
 * Reseña para email de solicitud
 */
export interface ReviewRequestEmail {
  orderId: string;
  orderNumber: string;
  product: {
    id: string;
    name: string;
    image: string | null;
    reviewUrl: string;
  };
  customerName: string;
  customerEmail: string;
  purchaseDate: Date;
}

/**
 * Votación de utilidad de reseña
 */
export interface ReviewVote {
  reviewId: string;
  userId: string;
  vote: 'helpful' | 'not_helpful';
  createdAt: Date;
}

/**
 * Moderación de reseña
 */
export interface ReviewModeration {
  reviewId: string;
  action: 'approve' | 'reject' | 'delete';
  reason?: string;
  moderatorId: string;
}
