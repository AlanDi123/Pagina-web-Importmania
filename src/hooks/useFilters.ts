'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { ProductFilters, ProductSort } from '@/types/product';
import type { Category } from '@prisma/client';

/**
 * Estado inicial de filtros
 */
const initialFilters: ProductFilters = {
  categoryIds: [],
  minPrice: undefined,
  maxPrice: undefined,
  inStock: undefined,
  minRating: undefined,
  tags: [],
  productType: undefined,
  isFeatured: undefined,
};

/**
 * Estado inicial de ordenamiento
 */
const initialSort: ProductSort = 'relevance';

/**
 * Hook para manejar filtros y ordenamiento de productos
 */
export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [sort, setSort] = useState<ProductSort>(initialSort);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [availableCategories, setAvailableCategories] = useState<Array<Category & { count: number }>>([]);
  const [availableTags, setAvailableTags] = useState<Array<{ name: string; count: number }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Cargar filtros disponibles desde la API
   */
  const loadAvailableFilters = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/productos/filters');
      const data = await response.json();
      
      setAvailableCategories(data.categories || []);
      setAvailableTags(data.tags || []);
      
      if (data.priceRange) {
        setPriceRange({
          min: data.priceRange.min,
          max: data.priceRange.max,
        });
      }
    } catch (error) {
      console.error('Error loading filters:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Actualizar filtros en la URL
   */
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Construir query params
    const params = new URLSearchParams(searchParams?.toString());

    // Categoría
    if (updatedFilters.categoryIds && updatedFilters.categoryIds.length > 0) {
      params.set('category', updatedFilters.categoryIds.join(','));
    } else {
      params.delete('category');
    }

    // Precio
    if (updatedFilters.minPrice !== undefined) {
      params.set('minPrice', updatedFilters.minPrice.toString());
    } else {
      params.delete('minPrice');
    }

    if (updatedFilters.maxPrice !== undefined) {
      params.set('maxPrice', updatedFilters.maxPrice.toString());
    } else {
      params.delete('maxPrice');
    }

    // Stock
    if (updatedFilters.inStock !== undefined) {
      params.set('inStock', updatedFilters.inStock.toString());
    } else {
      params.delete('inStock');
    }

    // Rating
    if (updatedFilters.minRating !== undefined) {
      params.set('minRating', updatedFilters.minRating.toString());
    } else {
      params.delete('minRating');
    }

    // Tipo de producto
    if (updatedFilters.productType) {
      params.set('type', updatedFilters.productType);
    } else {
      params.delete('type');
    }

    // Destacados
    if (updatedFilters.isFeatured) {
      params.set('featured', 'true');
    } else {
      params.delete('featured');
    }

    // Resetear página a 1
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, searchParams, pathname, router]);

  /**
   * Actualizar ordenamiento en la URL
   */
  const updateSort = useCallback((newSort: ProductSort) => {
    setSort(newSort);

    const params = new URLSearchParams(searchParams?.toString());
    
    if (newSort !== 'relevance') {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }

    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSort(initialSort);
    
    const params = new URLSearchParams(searchParams?.toString());
    params.delete('category');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('inStock');
    params.delete('minRating');
    params.delete('type');
    params.delete('featured');
    params.delete('sort');
    params.delete('page');

    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  /**
   * Limpiar filtro específico
   */
  const clearFilter = useCallback((filterName: keyof ProductFilters) => {
    const newFilters = { ...filters, [filterName]: undefined };
    
    if (filterName === 'categoryIds') {
      newFilters.categoryIds = [];
    } else if (filterName === 'tags') {
      newFilters.tags = [];
    }
    
    updateFilters({ [filterName]: newFilters[filterName] });
  }, [filters, updateFilters]);

  /**
   * Toggle categoría
   */
  const toggleCategory = useCallback((categoryId: string) => {
    const currentCategories = filters.categoryIds || [];
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    updateFilters({ categoryIds: newCategories });
  }, [filters.categoryIds, updateFilters]);

  /**
   * Toggle tag
   */
  const toggleTag = useCallback((tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];

    updateFilters({ tags: newTags });
  }, [filters.tags, updateFilters]);

  /**
   * Actualizar rango de precio
   */
  const updatePriceRange = useCallback((min: number | undefined, max: number | undefined) => {
    updateFilters({ minPrice: min, maxPrice: max });
  }, [updateFilters]);

  /**
   * Toggle stock
   */
  const toggleInStock = useCallback(() => {
    updateFilters({ inStock: !filters.inStock });
  }, [filters.inStock, updateFilters]);

  /**
   * Sincronizar con URL params al montar
   */
  useEffect(() => {
    const category = searchParams?.get('category');
    const minPrice = searchParams?.get('minPrice');
    const maxPrice = searchParams?.get('maxPrice');
    const inStock = searchParams?.get('inStock');
    const minRating = searchParams?.get('minRating');
    const productType = searchParams?.get('type') as ProductFilters['productType'];
    const isFeatured = searchParams?.get('featured') === 'true';
    const sortParam = searchParams?.get('sort') as ProductSort | null;

    const newFilters: ProductFilters = {};

    if (category) {
      newFilters.categoryIds = category.split(',');
    }

    if (minPrice) {
      newFilters.minPrice = parseFloat(minPrice);
    }

    if (maxPrice) {
      newFilters.maxPrice = parseFloat(maxPrice);
    }

    if (inStock !== null) {
      newFilters.inStock = inStock === 'true';
    }

    if (minRating) {
      newFilters.minRating = parseFloat(minRating);
    }

    if (productType) {
      newFilters.productType = productType;
    }

    if (isFeatured) {
      newFilters.isFeatured = true;
    }

    setFilters(newFilters);

    if (sortParam) {
      setSort(sortParam);
    }

    // Cargar filtros disponibles
    loadAvailableFilters();
  }, [searchParams, loadAvailableFilters]);

  /**
   * Query params para enviar a la API
   */
  const queryParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {};

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      params.category = filters.categoryIds.join(',');
    }

    if (filters.minPrice !== undefined) {
      params.minPrice = filters.minPrice;
    }

    if (filters.maxPrice !== undefined) {
      params.maxPrice = filters.maxPrice;
    }

    if (filters.inStock !== undefined) {
      params.inStock = filters.inStock;
    }

    if (filters.minRating !== undefined) {
      params.minRating = filters.minRating;
    }

    if (filters.productType) {
      params.productType = filters.productType;
    }

    if (filters.isFeatured) {
      params.isFeatured = true;
    }

    if (sort !== 'relevance') {
      params.sort = sort;
    }

    return params;
  }, [filters, sort]);

  /**
   * Verificar si hay filtros activos
   */
  const hasActiveFilters = useMemo(() => {
    return (
      (filters.categoryIds && filters.categoryIds.length > 0) ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.inStock !== undefined ||
      filters.minRating !== undefined ||
      filters.productType !== undefined ||
      filters.isFeatured !== undefined ||
      sort !== 'relevance'
    );
  }, [filters, sort]);

  /**
   * Contar filtros activos
   */
  const activeFiltersCount = useMemo(() => {
    let count = 0;

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      count += filters.categoryIds.length;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      count += 1;
    }

    if (filters.inStock !== undefined) count += 1;
    if (filters.minRating !== undefined) count += 1;
    if (filters.productType !== undefined) count += 1;
    if (filters.isFeatured !== undefined) count += 1;
    if (sort !== 'relevance') count += 1;

    return count;
  }, [filters, sort]);

  return {
    // Estado
    filters,
    sort,
    priceRange,
    availableCategories,
    availableTags,
    isLoading,
    hasActiveFilters,
    activeFiltersCount,
    
    // Acciones
    updateFilters,
    updateSort,
    clearFilters,
    clearFilter,
    toggleCategory,
    toggleTag,
    updatePriceRange,
    toggleInStock,
    loadAvailableFilters,
    
    // Query params para API
    queryParams,
  };
}

export default useFilters;
