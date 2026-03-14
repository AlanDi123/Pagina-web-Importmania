'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/storefront/StarRating';
import { cn } from '@/lib/utils';
import { formatARS } from '@/lib/formatters';

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface Tag {
  name: string;
  count?: number;
}

interface ProductFilters {
  categoryIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  minRating?: number;
  tags?: string[];
}

interface FilterSidebarProps {
  categories: Category[];
  priceRange: { min: number; max: number };
  tags: Tag[];
  activeFilters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({
  categories,
  priceRange,
  tags,
  activeFilters,
  onFilterChange,
  isMobile = false,
  onClose,
}: FilterSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([
    activeFilters.minPrice || priceRange.min,
    activeFilters.maxPrice || priceRange.max,
  ]);

  const handleCategoryToggle = (categoryId: string) => {
    const current = activeFilters.categoryIds || [];
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];

    onFilterChange({ categoryIds: updated.length > 0 ? updated : undefined });
  };

  const handleTagToggle = (tagName: string) => {
    const current = activeFilters.tags || [];
    const updated = current.includes(tagName)
      ? current.filter((t) => t !== tagName)
      : [...current, tagName];

    onFilterChange({ tags: updated.length > 0 ? updated : undefined });
  };

  const handlePriceApply = () => {
    onFilterChange({
      minPrice: localPriceRange[0] > priceRange.min ? localPriceRange[0] : undefined,
      maxPrice: localPriceRange[1] < priceRange.max ? localPriceRange[1] : undefined,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFilterChange({
      minRating: rating === activeFilters.minRating ? undefined : rating,
    });
  };

  const handleClearFilters = () => {
    setLocalPriceRange([priceRange.min, priceRange.max]);
    onFilterChange({
      categoryIds: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStock: undefined,
      minRating: undefined,
      tags: undefined,
    });
  };

  const hasActiveFilters =
    (activeFilters.categoryIds?.length || 0) > 0 ||
    activeFilters.minPrice !== undefined ||
    activeFilters.maxPrice !== undefined ||
    activeFilters.inStock ||
    activeFilters.minRating !== undefined ||
    (activeFilters.tags?.length || 0) > 0;

  return (
    <div className={cn('space-y-6', isMobile && 'p-4')}>
      {/* Header mobile */}
      {isMobile && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      )}

      {/* Categorías */}
      <div className="space-y-3">
        <h3 className="font-medium">Categorías</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={(activeFilters.categoryIds || []).includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <span className="text-sm">{category.name}</span>
              {category.count !== undefined && (
                <span className="text-xs text-muted-foreground">
                  ({category.count})
                </span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="space-y-4">
        <h3 className="font-medium">Precio</h3>
        <div className="space-y-4">
          <Slider
            value={localPriceRange}
            min={priceRange.min}
            max={priceRange.max}
            step={1000}
            onValueChange={(value) => setLocalPriceRange(value as [number, number])}
            className="mt-2"
          />
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="number"
                value={localPriceRange[0]}
                onChange={(e) =>
                  setLocalPriceRange([Number(e.target.value), localPriceRange[1]])
                }
                className="pr-8"
                min={priceRange.min}
                max={localPriceRange[1]}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
            </div>
            <span className="text-muted-foreground">-</span>
            <div className="relative flex-1">
              <Input
                type="number"
                value={localPriceRange[1]}
                onChange={(e) =>
                  setLocalPriceRange([localPriceRange[0], Number(e.target.value)])
                }
                className="pr-8"
                min={localPriceRange[0]}
                max={priceRange.max}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                $
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handlePriceApply}
          >
            Aplicar
          </Button>
        </div>
      </div>

      {/* Disponibilidad */}
      <div className="space-y-3">
        <h3 className="font-medium">Disponibilidad</h3>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm">Solo disponibles</span>
          <Switch
            checked={activeFilters.inStock || false}
            onCheckedChange={(checked) =>
              onFilterChange({ inStock: checked || undefined })
            }
          />
        </label>
      </div>

      {/* Calificación */}
      <div className="space-y-3">
        <h3 className="font-medium">Calificación</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={cn(
                'flex items-center gap-2 w-full p-2 rounded-md transition-colors',
                activeFilters.minRating === rating
                  ? 'bg-muted'
                  : 'hover:bg-muted/50'
              )}
            >
              <StarRating rating={rating} size="sm" />
              <span className="text-sm text-muted-foreground">& más</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = (activeFilters.tags || []).includes(tag.name);
              return (
                <Badge
                  key={tag.name}
                  variant={isActive ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag.name)}
                >
                  {tag.name}
                  {tag.count !== undefined && (
                    <span className="ml-1 text-xs opacity-70">({tag.count})</span>
                  )}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" className="w-full" onClick={handleClearFilters}>
          Limpiar filtros
        </Button>
      )}
    </div>
  );
}

export default FilterSidebar;
