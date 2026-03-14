import { z } from 'zod';

/**
 * Schema para validación de email
 */
export const emailSchema = z
  .string()
  .min(1, 'El email es requerido')
  .email('El email no es válido');

/**
 * Schema para validación de contraseña
 * Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula y 1 número
 */
export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número');

/**
 * Schema para validación de teléfono (Argentina)
 */
export const phoneSchema = z
  .string()
  .min(1, 'El teléfono es requerido')
  .regex(/^(\+54|0)?11[0-9]{8}$/, 'El teléfono debe ser válido (Argentina)');

/**
 * Schema para validación de nombre
 */
export const nameSchema = z
  .string()
  .min(2, 'El nombre debe tener al menos 2 caracteres')
  .max(100, 'El nombre no puede superar los 100 caracteres')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios');

/**
 * Schema para validación de slug
 */
export const slugSchema = z
  .string()
  .min(1, 'El slug es requerido')
  .max(200, 'El slug no puede superar los 200 caracteres')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug solo puede contener letras minúsculas, números y guiones');

/**
 * Schema para validación de precio
 */
export const priceSchema = z
  .number()
  .min(0, 'El precio no puede ser negativo')
  .max(999999999.99, 'El precio es demasiado alto');

/**
 * Schema para validación de stock
 */
export const stockSchema = z
  .number()
  .int('El stock debe ser un número entero')
  .min(0, 'El stock no puede ser negativo');

/**
 * Schema para creación de usuario (registro)
 */
export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  referralCode: z.string().optional(),
  newsletter: z.boolean().optional().default(false),
});

/**
 * Schema para login
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida'),
});

/**
 * Schema para actualización de perfil
 */
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  avatar: z.string().url().optional(),
});

/**
 * Schema para dirección
 */
export const addressSchema = z.object({
  label: z.string().min(1, 'La etiqueta es requerida').max(50),
  street: z.string().min(1, 'La calle es requerida').max(200),
  number: z.string().min(1, 'El número es requerido').max(20),
  floor: z.string().max(10).optional(),
  apartment: z.string().max(20).optional(),
  city: z.string().min(1, 'La ciudad es requerida').max(100),
  province: z.string().min(1, 'La provincia es requerida').max(100),
  postalCode: z.string().min(1, 'El código postal es requerido').max(20),
  country: z.string().default('Argentina'),
  isDefault: z.boolean().default(false),
  phone: phoneSchema.optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Schema para producto (creación/edición)
 */
export const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  slug: slugSchema.optional(),
  description: z.string().min(1, 'La descripción es requerida'),
  shortDescription: z.string().max(500).optional(),
  sku: z.string().min(1, 'El SKU es requerido').max(100),
  price: priceSchema,
  compareAtPrice: priceSchema.nullable().optional(),
  costPrice: priceSchema.nullable().optional(),
  productType: z.enum(['PHYSICAL', 'DIGITAL']),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  stock: stockSchema,
  lowStockThreshold: z.number().int().min(0).default(5),
  weight: z.number().positive().nullable().optional(),
  dimensions: z
    .object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .nullable()
    .optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  tags: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().optional(),
        isMain: z.boolean().default(false),
      })
    )
    .default([]),
  variants: z
    .array(
      z.object({
        name: z.string(),
        sku: z.string(),
        price: z.number().nullable().optional(),
        stock: z.number().int().min(0),
        isActive: z.boolean().default(true),
        options: z.record(z.string(), z.string()),
      })
    )
    .default([]),
  // Campos para productos digitales
  digitalFileUrl: z.string().url().nullable().optional(),
  digitalFileSize: z.string().optional(),
  downloadLimit: z.number().int().positive().nullable().optional(),
  downloadExpiry: z.number().int().positive().nullable().optional(),
});

/**
 * Schema para categoría
 */
export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  slug: slugSchema.optional(),
  description: z.string().max(1000).optional(),
  image: z.string().url().optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

/**
 * Schema para carrito
 */
export const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).max(999),
});

/**
 * Schema para checkout
 */
export const checkoutSchema = z.object({
  addressId: z.string().optional(),
  address: addressSchema.optional(),
  shippingMethod: z.enum(['HOME_DELIVERY', 'ANDREANI', 'OCA', 'CORREO_ARGENTINO', 'PICKUP']),
  paymentMethod: z.enum(['MERCADOPAGO', 'TRANSFER', 'CASH']),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
  acceptTerms: z.boolean().refine((val) => val === true, 'Debes aceptar los términos y condiciones'),
});

/**
 * Schema para cupón
 */
export const couponSchema = z.object({
  code: z.string().min(1, 'El código es requerido').max(50).toUpperCase(),
  description: z.string().max(200).optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING']),
  value: z.number().positive(),
  minPurchase: z.number().nonnegative().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  perUserLimit: z.number().int().min(1).default(1),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isActive: z.boolean().default(true),
  applicableCategories: z.array(z.string()).default([]),
  applicableProducts: z.array(z.string()).default([]),
});

/**
 * Schema para reseña
 */
export const reviewSchema = z.object({
  productId: z.string(),
  orderId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  comment: z.string().max(1000).optional(),
});

/**
 * Schema para post de blog
 */
export const blogPostSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(200),
  slug: slugSchema.optional(),
  content: z.string().min(1, 'El contenido es requerido'),
  excerpt: z.string().max(300).optional(),
  coverImage: z.string().url().optional(),
  authorName: z.string().default('iMPORTMANIA'),
  isPublished: z.boolean().default(false),
  publishedAt: z.date().optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
  tags: z.array(z.string()).default([]),
});

/**
 * Schema para zona de envío
 */
export const shippingZoneSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  provinces: z.array(z.string()).default([]),
  postalCodes: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
});

/**
 * Schema para tarifa de envío
 */
export const shippingRateSchema = z.object({
  zoneId: z.string(),
  method: z.enum(['HOME_DELIVERY', 'ANDREANI', 'OCA', 'CORREO_ARGENTINO', 'PICKUP']),
  name: z.string().min(1, 'El nombre es requerido').max(100),
  price: z.number().nonnegative(),
  freeAbove: z.number().nonnegative().optional(),
  estimatedDays: z.string().max(50),
  maxWeight: z.number().positive().optional(),
  isActive: z.boolean().default(true),
});

/**
 * Schema para configuración de tienda
 */
export const storeConfigSchema = z.object({
  // General
  storeName: z.string().min(1).max(100),
  storeSlogan: z.string().max(200).optional(),
  contactEmail: emailSchema,
  contactPhone: z.string().max(50),
  storeAddress: z.string().max(300),
  storeHours: z.string().max(200),
  logo: z.string().url().optional(),
  favicon: z.string().url().optional(),
  // Redes sociales
  instagramUrl: z.string().url().optional(),
  tiktokUrl: z.string().url().optional(),
  whatsappNumber: z.string().max(50),
  // Pagos
  mpAccessToken: z.string().optional(),
  mpPublicKey: z.string().optional(),
  mpWebhookSecret: z.string().optional(),
  bankCbu: z.string().max(50).optional(),
  bankAlias: z.string().max(100).optional(),
  bankHolder: z.string().max(100).optional(),
  bankCuit: z.string().max(20).optional(),
  bankName: z.string().max(100).optional(),
  transferDiscountPercent: z.number().min(0).max(100).default(10),
  // SEO
  defaultSeoTitle: z.string().max(60).optional(),
  defaultSeoDescription: z.string().max(160).optional(),
  gaId: z.string().max(50).optional(),
  fbPixelId: z.string().max(50).optional(),
  tiktokPixelId: z.string().max(50).optional(),
  googleMerchantCode: z.string().max(100).optional(),
  // Email
  resendApiKey: z.string().optional(),
  emailFrom: z.string().max(200).optional(),
  // Referidos
  referralsEnabled: z.boolean().default(true),
  referralRewardType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).default('PERCENTAGE'),
  referralRewardValue: z.number().positive().default(10),
  referralDiscountForReferred: z.boolean().default(true),
  // Promo bar
  promoBarText: z.string().max(200).optional(),
  promoBarEnabled: z.boolean().default(true),
});

/**
 * Schema para búsqueda
 */
export const searchSchema = z.object({
  q: z.string().min(1, 'El término de búsqueda es requerido').max(200),
  category: z.string().optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  inStock: z.boolean().optional(),
  minRating: z.number().min(0).max(5).optional(),
  sort: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'bestselling', 'rating']).default('relevance'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(12),
});

/**
 * Helper para validar schemas de forma segura
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: z.ZodError } {
  const result = schema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true, data: result.data };
}

export default {
  emailSchema,
  passwordSchema,
  phoneSchema,
  nameSchema,
  slugSchema,
  priceSchema,
  stockSchema,
  createUserSchema,
  loginSchema,
  updateProfileSchema,
  addressSchema,
  productSchema,
  categorySchema,
  cartItemSchema,
  checkoutSchema,
  couponSchema,
  reviewSchema,
  blogPostSchema,
  shippingZoneSchema,
  shippingRateSchema,
  storeConfigSchema,
  searchSchema,
  validateSchema,
};
