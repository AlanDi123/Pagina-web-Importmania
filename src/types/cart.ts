import type { CartItem, Product, ProductVariant } from '@prisma/client';

/**
 * Item del carrito con información completa del producto
 */
export interface CartItemWithProduct extends CartItem {
  product: Product;
  variant: ProductVariant | null;
}

/**
 * Item del carrito para mostrar en UI
 */
export interface CartItemDisplay {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  mainImage: string | null;
  variantName: string | null;
  variantOptions: Record<string, string> | null;
  subtotal: number;
  discountPercentage: number | null;
  isAvailable: boolean;
  isDigital: boolean;
}

/**
 * Carrito completo con totales
 */
export interface Cart {
  items: CartItemDisplay[];
  itemsCount: number;
  subtotal: number;
  totalDiscount: number;
  shippingCost: number;
  transferDiscount: number;
  total: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

/**
 * Carrito en estado vacío
 */
export interface EmptyCart {
  items: [];
  itemsCount: 0;
  subtotal: 0;
  totalDiscount: 0;
  shippingCost: 0;
  transferDiscount: 0;
  total: 0;
  isFreeShipping: false;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
}

/**
 * Datos para agregar al carrito
 */
export interface AddToCartData {
  productId: string;
  variantId?: string;
  quantity: number;
}

/**
 * Datos para actualizar cantidad
 */
export interface UpdateQuantityData {
  itemId: string;
  quantity: number;
}

/**
 * Resultado de validación de carrito
 */
export interface CartValidationResult {
  isValid: boolean;
  errors: Array<{
    itemId: string;
    productName: string;
    error: 'OUT_OF_STOCK' | 'PRICE_CHANGED' | 'PRODUCT_UNAVAILABLE' | 'QUANTITY_EXCEEDED';
    message: string;
    currentStock?: number;
    requestedQuantity?: number;
    oldPrice?: number;
    newPrice?: number;
  }>;
  warnings: Array<{
    itemId: string;
    productName: string;
    warning: 'LOW_STOCK' | 'PARTIAL_AVAILABILITY';
    message: string;
  }>;
}

/**
 * Cupón aplicado al carrito
 */
export interface AppliedCoupon {
  code: string;
  description: string | null;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  discountAmount: number;
  minPurchase: number | null;
  maxDiscount: number | null;
  isValid: boolean;
  errorMessage: string | null;
}

/**
 * Resumen del carrito para checkout
 */
export interface CartSummary {
  items: Array<{
    productId: string;
    variantId: string | null;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  itemsCount: number;
  totalWeight: number;
}

/**
 * Carrito abandonado (para email marketing)
 */
export interface AbandonedCart {
  userId: string;
  userEmail: string;
  items: CartItemDisplay[];
  total: number;
  lastUpdated: Date;
  recoveryEmailSent: boolean;
  recoveryEmailSentAt: Date | null;
}

/**
 * Estado del carrito en Zustand
 */
export interface CartState {
  items: CartItemDisplay[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  coupon: AppliedCoupon | null;
}

/**
 * Acciones del store del carrito
 */
export interface CartActions {
  addItem: (item: AddToCartData) => Promise<void>;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  syncWithServer: () => Promise<void>;
  validateCart: () => Promise<CartValidationResult>;
  getCartSummary: () => CartSummary;
}

/**
 * Producto en el carrito con stock verificado
 */
export interface VerifiedCartItem extends CartItemDisplay {
  verifiedStock: number;
  verifiedPrice: number;
  maxQuantity: number;
  canAddMore: boolean;
}
