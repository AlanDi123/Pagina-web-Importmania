import type { Product, ProductImage, ProductVariant, ProductCategory, Category } from '@prisma/client';

/**
 * Tipo completo de Producto con relaciones
 */
export interface ProductWithRelations extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
  categories: (ProductCategory & {
    category: Category;
  })[];
}

/**
 * Producto para listar en catálogo
 */
export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  productType: 'PHYSICAL' | 'DIGITAL';
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  averageRating: number;
  reviewCount: number;
  salesCount: number;
  mainImage: string | null;
  categories: string[];
  tags: string[];
  createdAt: Date;
}

/**
 * Producto para detalle (con toda la información)
 */
export interface ProductDetail extends ProductWithRelations {
  mainImage: ProductImage | null;
  galleryImages: ProductImage[];
  hasVariants: boolean;
  variantOptions: VariantOption[];
  discountPercentage: number | null;
}

/**
 * Opción de variante (ej: Color, Talle)
 */
export interface VariantOption {
  name: string;
  values: string[];
}

/**
 * Variante seleccionada
 */
export interface SelectedVariant {
  id: string;
  name: string;
  sku: string;
  price: number | null;
  stock: number;
  isActive: boolean;
  options: Record<string, string>;
}

/**
 * Filtros para búsqueda de productos
 */
export interface ProductFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  tags?: string[];
  productType?: 'PHYSICAL' | 'DIGITAL';
  isFeatured?: boolean;
}

/**
 * Ordenamiento de productos
 */
export type ProductSort =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'bestselling'
  | 'rating';

/**
 * Parámetros de consulta para productos
 */
export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: ProductSort;
  filters?: ProductFilters;
  search?: string;
  categorySlug?: string;
}

/**
 * Resultado paginado de productos
 */
export interface PaginatedProducts {
  products: ProductListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    availableCategories: Array<{ id: string; name: string; count: number }>;
    priceRange: { min: number; max: number };
    availableTags: Array<{ name: string; count: number }>;
  };
}

/**
 * Datos para crear/editar producto
 */
export interface ProductFormData {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  productType: 'PHYSICAL' | 'DIGITAL';
  isActive: boolean;
  isFeatured: boolean;
  stock: number;
  lowStockThreshold: number;
  weight?: number | null;
  dimensions?: { length: number; width: number; height: number } | null;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  categoryIds: string[];
  images: Array<{
    url: string;
    alt?: string;
    isMain: boolean;
  }>;
  variants: Array<{
    name: string;
    sku: string;
    price?: number | null;
    stock: number;
    isActive: boolean;
    options: Record<string, string>;
  }>;
  digitalFileUrl?: string | null;
  digitalFileSize?: string;
  downloadLimit?: number | null;
  downloadExpiry?: number | null;
}

/**
 * Datos para crear variante
 */
export interface VariantFormData {
  attributeName: string;
  attributeValues: string[];
}

/**
 * Imagen de producto
 */
export interface ProductImageFormData {
  file: File;
  alt?: string;
  isMain?: boolean;
}

/**
 * Stock update payload
 */
export interface StockUpdate {
  productId: string;
  variantId?: string;
  stock: number;
  operation?: 'set' | 'add' | 'remove';
}

export default {
  type ProductWithRelations,
  type ProductListItem,
  type ProductDetail,
  type VariantOption,
  type SelectedVariant,
  type ProductFilters,
  type ProductSort,
  type ProductQuery,
  type PaginatedProducts,
  type ProductFormData,
  type VariantFormData,
  type ProductImageFormData,
  type StockUpdate,
};
