'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface WishlistButtonProps {
  productId: string;
  productName: string;
  productSlug: string;
  productPrice: number;
  productCompareAtPrice: number | null;
  productImage: string | null;
  productStock: number;
  productRating: number;
  variant?: 'icon' | 'button';
  className?: string;
}

export function WishlistButton({
  productId,
  productName,
  productSlug,
  productPrice,
  productCompareAtPrice,
  productImage,
  productStock,
  productRating,
  variant = 'icon',
  className,
}: WishlistButtonProps) {
  const { isInWishlist, toggleProduct, itemCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const isLiked = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar a favoritos');
      router.push('/login');
      return;
    }

    toggleProduct({
      id: productId,
      name: productName,
      slug: productSlug,
      price: productPrice,
      compareAtPrice: productCompareAtPrice,
      mainImage: productImage,
      stock: productStock,
      averageRating: productRating,
    });
  };

  if (variant === 'button') {
    return (
      <Button
        variant={isLiked ? 'default' : 'outline'}
        size="sm"
        onClick={handleClick}
        className={cn('gap-2', className)}
      >
        <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
        {isLiked ? 'En favoritos' : 'Agregar a favoritos'}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        'h-9 w-9 rounded-full transition-colors',
        isLiked
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
          : 'text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950',
        className
      )}
      aria-label={isLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
      {itemCount > 0 && isLiked && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-primary text-[10px] font-bold text-white flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  );
}

export default WishlistButton;
