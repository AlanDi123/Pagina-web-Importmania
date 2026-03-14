'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/storefront/StarRating';
import { WishlistButton } from '@/components/storefront/WishlistButton';
import { formatARS } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { ProductListItem } from '@/types/product';

interface ProductCardProps extends Omit<ProductListItem, 'categories' | 'tags'> {
  mainImage: string | null;
  className?: string;
  showBadge?: boolean;
  quickAdd?: boolean;
}

export function ProductCard({
  id,
  name,
  slug,
  shortDescription,
  sku,
  price,
  compareAtPrice,
  productType,
  isActive,
  isFeatured,
  stock,
  averageRating,
  reviewCount,
  salesCount,
  mainImage,
  createdAt,
  className,
  showBadge = true,
  quickAdd = false,
}: ProductCardProps) {
  // Calcular descuento
  const discountPercentage = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : null;

  // Verificar si es nuevo (menos de 7 días)
  const isNew = createdAt && Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;

  // Verificar stock
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    <div
      className={cn(
        'group relative bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300',
        className
      )}
    >
      {/* Imagen del producto */}
      <Link href={`/productos/${slug}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            priority={false}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-text-secondary">
            <span className="text-4xl">📦</span>
          </div>
        )}

        {/* Badges */}
        {showBadge && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOutOfStock && (
              <Badge variant="destructive" size="sm">
                Sin stock
              </Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge variant="warning" size="sm">
                ¡Últimos {stock}!
              </Badge>
            )}
            {isNew && (
              <Badge variant="brand" size="sm">
                NUEVO
              </Badge>
            )}
            {isFeatured && (
              <Badge variant="accent" size="sm">
                DESTACADO
              </Badge>
            )}
            {discountPercentage && discountPercentage > 10 && !isOutOfStock && (
              <Badge variant="destructive" size="sm">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        )}

        {/* Wishlist button (visible en hover) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <WishlistButton
            productId={id}
            productName={name}
            productSlug={slug}
            productPrice={price}
            productCompareAtPrice={compareAtPrice}
            productImage={mainImage}
            productStock={stock}
            productRating={averageRating}
          />
        </div>

        {/* Quick add button (visible en hover) */}
        {quickAdd && !isOutOfStock && (
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="w-full bg-brand-primary text-white py-2 px-4 rounded-md font-medium hover:bg-brand-primary/90 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implementar quick add
              }}
            >
              Agregar al carrito
            </button>
          </div>
        )}
      </Link>

      {/* Información del producto */}
      <div className="p-4 space-y-2">
        {/* SKU (solo en mobile) */}
        <p className="text-xs text-text-secondary md:hidden">{sku}</p>

        {/* Nombre */}
        <Link href={`/productos/${slug}`}>
          <h3 className="font-medium text-text-primary line-clamp-2 hover:text-brand-primary transition-colors">
            {name}
          </h3>
        </Link>

        {/* Descripción corta (solo desktop) */}
        {shortDescription && (
          <p className="text-sm text-text-secondary line-clamp-2 hidden md:block">
            {shortDescription}
          </p>
        )}

        {/* Rating */}
        {averageRating > 0 && (
          <StarRating
            rating={averageRating}
            reviewCount={reviewCount}
            size="sm"
          />
        )}

        {/* Precio */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-brand-primary">
            {formatARS(price)}
          </span>
          {compareAtPrice && (
            <span className="text-sm text-text-secondary line-through">
              {formatARS(compareAtPrice)}
            </span>
          )}
        </div>

        {/* Envío gratis */}
        {price >= 50000 && (
          <p className="text-xs text-brand-secondary font-medium">
            🚚 ¡Envío gratis!
          </p>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
