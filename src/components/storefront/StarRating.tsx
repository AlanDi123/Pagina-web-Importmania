'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  interactive = false,
  onRate,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const handleClick = (index: number) => {
    if (interactive && onRate) {
      onRate(index + 1);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: maxRating }).map((_, index) => {
          const isFilled = index < Math.floor(rating);
          const isHalf = !isFilled && index < rating;

          return (
            <button
              key={index}
              type={interactive ? 'button' : undefined}
              onClick={() => handleClick(index)}
              disabled={!interactive}
              className={cn(
                'transition-colors',
                interactive && 'hover:scale-110 cursor-pointer',
                !interactive && 'cursor-default'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  isFilled
                    ? 'fill-yellow-400 text-yellow-400'
                    : isHalf
                      ? 'fill-yellow-400/50 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-text-primary">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-text-secondary">
          ({reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'})
        </span>
      )}
    </div>
  );
}

export default StarRating;
