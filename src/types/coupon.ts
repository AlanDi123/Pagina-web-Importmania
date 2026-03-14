import type { Coupon, CouponType } from '@prisma/client';

/**
 * Cupón con información adicional
 */
export interface CouponWithStats extends Coupon {
  usagePercentage: number;
  isActiveNow: boolean;
  isExpired: boolean;
  isScheduled: boolean;
  applicableCategoriesCount: number;
  applicableProductsCount: number;
}

/**
 * Cupón para listar en admin
 */
export interface CouponListItem {
  id: string;
  code: string;
  description: string | null;
  type: CouponType;
  value: number;
  usageCount: number;
  usageLimit: number | null;
  perUserLimit: number;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Cupón para mostrar al cliente
 */
export interface CouponDisplay {
  code: string;
  description: string | null;
  type: CouponType;
  value: number;
  typeLabel: string;
  valueLabel: string;
  minPurchase: number | null;
  maxDiscount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  isExpired: boolean;
  isScheduled: boolean;
  canUse: boolean;
  usageCount: number;
  usageLimit: number | null;
  perUserLimit: number;
  userUsageCount: number;
}

/**
 * Datos para crear/editar cupón
 */
export interface CouponFormData {
  code: string;
  description?: string;
  type: CouponType;
  value: number;
  minPurchase?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  perUserLimit: number;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive: boolean;
  applicableCategories: string[];
  applicableProducts: string[];
}

/**
 * Resultado de validación de cupón
 */
export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  errorMessage?: string;
  errorType?:
    | 'INVALID_CODE'
    | 'INACTIVE'
    | 'EXPIRED'
    | 'NOT_STARTED'
    | 'USAGE_LIMIT_REACHED'
    | 'USER_LIMIT_REACHED'
    | 'MIN_PURCHASE_NOT_MET'
    | 'PRODUCT_NOT_APPLICABLE'
    | 'CATEGORY_NOT_APPLICABLE';
}

/**
 * Cupón aplicado a un carrito
 */
export interface AppliedCoupon {
  code: string;
  description: string | null;
  type: CouponType;
  value: number;
  discountAmount: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Estadísticas de cupones
 */
export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  scheduledCoupons: number;
  totalDiscountGiven: number;
  totalUses: number;
  topCoupons: Array<{
    code: string;
    uses: number;
    discountGiven: number;
  }>;
}

/**
 * Filtros para búsqueda de cupones
 */
export interface CouponFilters {
  type?: CouponType;
  isActive?: boolean;
  isExpired?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  minUses?: number;
}

/**
 * Tipo de cupón con etiqueta
 */
export interface CouponTypeLabel {
  type: CouponType;
  label: string;
  description: string;
}

/**
 * Cupón generado para referido
 */
export interface ReferralCoupon {
  code: string;
  type: CouponType;
  value: number;
  description: string;
  expiresAt: Date;
  forUser: string; // email del usuario
}

/**
 * Uso de cupón por usuario
 */
export interface CouponUsage {
  couponId: string;
  couponCode: string;
  userId: string;
  userEmail: string;
  orderId: string;
  orderNumber: string;
  discountAmount: number;
  usedAt: Date;
}
