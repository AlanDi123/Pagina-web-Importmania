'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  productCount?: number;
}

interface CategoryCarouselProps {
  categories: Category[];
  title?: string;
  className?: string;
}

export function CategoryCarousel({
  categories,
  title = 'Categorías',
  className,
}: CategoryCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    const container = document.getElementById('category-carousel');
    if (container) {
      const newPosition = Math.max(0, scrollPosition - 300);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('category-carousel');
    if (container) {
      const newPosition = scrollPosition + 300;
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className={cn('py-8 sm:py-12', className)}>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            {title}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollLeft}
              disabled={scrollPosition === 0}
              className="h-10 w-10 rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollRight}
              className="h-10 w-10 rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div
          id="category-carousel"
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="flex-shrink-0 w-40 sm:w-48 group"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-border group-hover:border-brand-primary transition-colors">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 160px, 192px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl">
                    📦
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Nombre de categoría */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-medium text-sm sm:text-base truncate">
                    {category.name}
                  </h3>
                  {category.productCount !== undefined && (
                    <p className="text-white/80 text-xs">
                      {category.productCount} productos
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

export default CategoryCarousel;
