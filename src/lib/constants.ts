/**
 * Constantes de la aplicación iMPORTMANIA
 */

// ============================================
// GENERALES
// ============================================

export const APP_NAME = 'iMPORTMANIA';
export const APP_DESCRIPTION = 'Tu tienda online de productos importados en Argentina';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ============================================
// COLORES DE MARCA
// ============================================

export const BRAND_COLORS = {
  primary: '#00BFFF',    // Celeste
  secondary: '#2ECC71',  // Verde
  accent: '#FF8C00',     // Naranja
  background: {
    light: '#F8FAFC',
    dark: '#0F172A',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
  },
} as const;

// ============================================
// LÍMITES Y PAGINACIÓN
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  PRODUCTS_PER_PAGE: 12,
  ORDERS_PER_PAGE: 20,
  CUSTOMERS_PER_PAGE: 20,
  BLOG_POSTS_PER_PAGE: 9,
  REVIEWS_PER_PAGE: 10,
} as const;

export const LIMITS = {
  MAX_CART_QUANTITY: 999,
  MAX_WISHLIST_ITEMS: 100,
  MAX_RECENTLY_VIEWED: 10,
  MAX_RELATED_PRODUCTS: 4,
  MAX_FEATURED_PRODUCTS: 8,
  MAX_NEW_PRODUCTS: 8,
  MAX_HERO_SLIDES: 5,
  MAX_PRODUCT_IMAGES: 10,
  MAX_VARIANT_OPTIONS: 5,
  MAX_VARIANT_VALUES: 20,
} as const;

// ============================================
// PRECIOS Y DESCUENTOS
// ============================================

export const PRICE_RANGE = {
  MIN: 0,
  MAX: 9999999.99,
  STEP: 100,
} as const;

export const DISCOUNT_TYPES = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING',
} as const;

export const DEFAULT_TRANSFER_DISCOUNT = 10; // 10%

// ============================================
// ENVÍOS
// ============================================

export const SHIPPING_METHODS = {
  HOME_DELIVERY: 'HOME_DELIVERY',
  ANDREANI: 'ANDREANI',
  OCA: 'OCA',
  CORREO_ARGENTINO: 'CORREO_ARGENTINO',
  PICKUP: 'PICKUP',
} as const;

export const SHIPPING_METHOD_LABELS: Record<string, string> = {
  HOME_DELIVERY: 'Envío a domicilio',
  ANDREANI: 'Andreani',
  OCA: 'OCA',
  CORREO_ARGENTINO: 'Correo Argentino',
  PICKUP: 'Retiro en persona',
} as const;

export const FREE_SHIPPING_MIN_AMOUNT = 50000; // $50.000 ARS

// ============================================
// PROVINCIAS DE ARGENTINA
// ============================================

export const ARGENTINA_PROVINCES = [
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán',
] as const;

// ============================================
// ESTADOS DE PEDIDOS
// ============================================

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  PICKUP_READY: 'PICKUP_READY',
  PICKED_UP: 'PICKED_UP',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  PAYMENT_RECEIVED: 'Pago recibido',
  PROCESSING: 'En preparación',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
  PICKUP_READY: 'Listo para retirar',
  PICKED_UP: 'Retirado',
} as const;

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAYMENT_RECEIVED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
  PICKUP_READY: 'bg-cyan-100 text-cyan-800',
  PICKED_UP: 'bg-emerald-100 text-emerald-800',
} as const;

// ============================================
// ESTADOS DE PAGO
// ============================================

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
  IN_REVIEW: 'IN_REVIEW',
} as const;

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado',
  IN_REVIEW: 'En revisión',
} as const;

// ============================================
// MÉTODOS DE PAGO
// ============================================

export const PAYMENT_METHODS = {
  MERCADOPAGO: 'MERCADOPAGO',
  TRANSFER: 'TRANSFER',
  CASH: 'CASH',
} as const;

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  MERCADOPAGO: 'MercadoPago',
  TRANSFER: 'Transferencia bancaria',
  CASH: 'Efectivo',
} as const;

// ============================================
// ROLES DE USUARIO
// ============================================

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;

export const USER_ROLE_LABELS: Record<string, string> = {
  CUSTOMER: 'Cliente',
  ADMIN: 'Administrador',
} as const;

// ============================================
// TIPOS DE PRODUCTO
// ============================================

export const PRODUCT_TYPES = {
  PHYSICAL: 'PHYSICAL',
  DIGITAL: 'DIGITAL',
} as const;

export const PRODUCT_TYPE_LABELS: Record<string, string> = {
  PHYSICAL: 'Producto físico',
  DIGITAL: 'Producto digital',
} as const;

// ============================================
// NOTIFICACIONES
// ============================================

export const NOTIFICATION_TYPES = {
  NEW_ORDER: 'NEW_ORDER',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  ORDER_SHIPPED: 'ORDER_SHIPPED',
  ORDER_DELIVERED: 'ORDER_DELIVERED',
  LOW_STOCK: 'LOW_STOCK',
  NEW_REVIEW: 'NEW_REVIEW',
  NEW_USER: 'NEW_USER',
  ABANDONED_CART: 'ABANDONED_CART',
  REFERRAL_COMPLETED: 'REFERRAL_COMPLETED',
  SYSTEM: 'SYSTEM',
} as const;

export const NOTIFICATION_CHANNELS = {
  IN_APP: 'IN_APP',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH',
  WHATSAPP: 'WHATSAPP',
} as const;

// ============================================
// BUCKETS DE SUPABASE STORAGE
// ============================================

export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  CATEGORY_IMAGES: 'category-images',
  BLOG_IMAGES: 'blog-images',
  TRANSFER_RECEIPTS: 'transfer-receipts',
  STORE_LOGO: 'store-logo',
  USER_AVATARS: 'user-avatars',
} as const;

// ============================================
// COOKIES
// ============================================

export const COOKIES = {
  CART: 'importmania_cart',
  WISHLIST: 'importmania_wishlist',
  THEME: 'importmania_theme',
  SESSION: 'importmania_session',
  RECENTLY_VIEWED: 'importmania_recently_viewed',
} as const;

// ============================================
// LOCALES STORAGE
// ============================================

export const LOCAL_STORAGE = {
  CART: 'importmania_cart',
  WISHLIST: 'importmania_wishlist',
  THEME: 'importmania_theme',
  RECENTLY_VIEWED: 'importmania_recently_viewed',
  PROMO_BAR_DISMISSED: 'importmania_promo_bar_dismissed',
} as const;

// ============================================
// REDES SOCIALES
// ============================================

export const SOCIAL_NETWORKS = {
  INSTAGRAM: 'instagram',
  TIKTOK: 'tiktok',
  WHATSAPP: 'whatsapp',
  FACEBOOK: 'facebook',
  TWITTER: 'twitter',
} as const;

// ============================================
// SEO
// ============================================

export const SEO = {
  DEFAULT_TITLE: 'iMPORTMANIA - Productos importados en Argentina',
  DEFAULT_DESCRIPTION: 'Tienda online de productos importados. Envíos a todo el país. Pagá con MercadoPago, transferencia o efectivo.',
  DEFAULT_KEYWORDS: ['productos importados', 'tienda online', 'Argentina', 'envíos', 'MercadoPago'],
  OPEN_GRAPH_TYPE: 'website',
  TWITTER_CARD: 'summary_large_image',
} as const;

// ============================================
// ANALYTICS EVENTS
// ============================================

export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  VIEW_ITEM: 'view_item',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_PAYMENT_INFO: 'add_payment_info',
  ADD_SHIPPING_INFO: 'add_shipping_info',
  PURCHASE: 'purchase',
  SEARCH: 'search',
  VIEW_ITEM_LIST: 'view_item_list',
  SELECT_ITEM: 'select_item',
  VIEW_CART: 'view_cart',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  SIGN_UP: 'sign_up',
  LOGIN: 'login',
  CONTACT: 'contact',
} as const;

// ============================================
// CRON JOBS
// ============================================

export const CRON_SCHEDULES = {
  ABANDONED_CART: '0 */6 * * *', // Cada 6 horas
  SITEMAP: '0 3 * * *', // Todos los días a las 3 AM
  LOW_STOCK_ALERT: '0 9 * * *', // Todos los días a las 9 AM
  REVIEW_REQUEST: '0 10 * * *', // Todos los días a las 10 AM
} as const;

// ============================================
// TIEMPOS
// ============================================

export const TIME = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  FIFTEEN_MINUTES: 15 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  SIX_HOURS: 6 * 60 * 60 * 1000,
  TWENTY_FOUR_HOURS: 24 * 60 * 60 * 1000,
  SEVEN_DAYS: 7 * 24 * 60 * 60 * 1000,
  THIRTY_DAYS: 30 * 24 * 60 * 60 * 1000,
} as const;

export const ABANDONED_CART_THRESHOLD = TIME.TWENTY_FOUR_HOURS;
export const REVIEW_REQUEST_DELAY = TIME.SEVEN_DAYS;

// ============================================
// DEBOUNCE Y THROTTLE
// ============================================

export const DEBOUNCE = {
  SEARCH: 300,
  FILTER_CHANGE: 300,
  FORM_VALIDATION: 200,
} as const;

export const THROTTLE = {
  SCROLL: 100,
  RESIZE: 200,
  API_CALL: 1000,
} as const;

// ============================================
// MENSAJES DE ERROR
// ============================================

export const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  INVALID_EMAIL: 'El email no es válido',
  INVALID_PHONE: 'El teléfono no es válido',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres',
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
  CATEGORY_NOT_FOUND: 'Categoría no encontrada',
  ORDER_NOT_FOUND: 'Pedido no encontrado',
  USER_NOT_FOUND: 'Usuario no encontrado',
  UNAUTHORIZED: 'No tienes permiso para realizar esta acción',
  UNAUTHENTICATED: 'Debes iniciar sesión',
  SERVER_ERROR: 'Ocurrió un error. Por favor intentá de nuevo más tarde.',
  NETWORK_ERROR: 'Error de conexión. Verificá tu conexión a internet.',
  RATE_LIMIT_EXCEEDED: 'Demasiadas solicitudes. Por favor esperá un momento.',
} as const;

// ============================================
// MENSAJES DE ÉXITO
// ============================================

export const SUCCESS_MESSAGES = {
  CART_ADDED: 'Producto agregado al carrito',
  CART_REMOVED: 'Producto eliminado del carrito',
  CART_UPDATED: 'Carrito actualizado',
  ORDER_CREATED: 'Pedido creado exitosamente',
  PAYMENT_SUCCESS: 'Pago realizado exitosamente',
  REVIEW_SUBMITTED: 'Reseña enviada exitosamente',
  NEWSLETTER_SUBSCRIBED: 'Te suscribiste al newsletter',
  PROFILE_UPDATED: 'Perfil actualizado',
  PASSWORD_CHANGED: 'Contraseña cambiada',
  ACCOUNT_CREATED: 'Cuenta creada exitosamente',
} as const;

export default {
  APP_NAME,
  APP_DESCRIPTION,
  BRAND_COLORS,
  PAGINATION,
  LIMITS,
  PRICE_RANGE,
  DISCOUNT_TYPES,
  SHIPPING_METHODS,
  SHIPPING_METHOD_LABELS,
  ARGENTINA_PROVINCES,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  USER_ROLES,
  USER_ROLE_LABELS,
  PRODUCT_TYPES,
  PRODUCT_TYPE_LABELS,
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  STORAGE_BUCKETS,
  COOKIES,
  LOCAL_STORAGE,
  SOCIAL_NETWORKS,
  SEO,
  ANALYTICS_EVENTS,
  CRON_SCHEDULES,
  TIME,
  DEBOUNCE,
  THROTTLE,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
