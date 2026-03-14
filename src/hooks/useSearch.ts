'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DEBOUNCE } from '@/lib/constants';

/**
 * Resultado de búsqueda
 */
export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  mainImage: string | null;
  category: string | null;
}

/**
 * Sugerencia de búsqueda
 */
export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  type: 'product' | 'category';
  image?: string | null;
  price?: number;
}

/**
 * Estado del hook de búsqueda
 */
interface UseSearchReturn {
  // Estado
  query: string;
  results: SearchResult[];
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  error: string | null;
  totalResults: number;
  hasSearched: boolean;
  
  // Acciones
  setQuery: (query: string) => void;
  clearQuery: () => void;
  search: (query?: string) => Promise<void>;
  loadSuggestions: (query: string) => Promise<void>;
  clearSuggestions: () => void;
  
  // Navegación
  navigateToSearch: () => void;
}

/**
 * Hook para búsqueda de productos con autocompletado
 */
export function useSearch(): UseSearchReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Buscar productos
   */
  const search = useCallback(async (searchQuery?: string) => {
    const q = searchQuery ?? query;
    
    if (!q.trim()) {
      setResults([]);
      setTotalResults(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/buscar?q=${encodeURIComponent(q)}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar');
      }

      const data = await response.json();
      
      setResults(data.products || []);
      setTotalResults(data.total || 0);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar');
      setResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  /**
   * Cargar sugerencias
   */
  const loadSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/buscar/suggestions?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar sugerencias');
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Error loading suggestions:', err);
      setSuggestions([]);
    }
  }, []);

  /**
   * Limpiar sugerencias
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  /**
   * Navegar a página de búsqueda
   */
  const navigateToSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query)}`);
    }
  }, [query, router]);

  /**
   * Limpiar query
   */
  const clearQuery = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setHasSearched(false);
  }, []);

  /**
   * Efecto para búsqueda con debounce
   */
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        search(query);
        loadSuggestions(query);
      }, DEBOUNCE.SEARCH);
    } else {
      setResults([]);
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, search, loadSuggestions]);

  /**
   * Sincronizar query con URL params
   */
  useEffect(() => {
    const q = searchParams?.get('q');
    if (q && pathname === '/buscar') {
      setQuery(q);
      search(q);
    }
  }, [searchParams, pathname, search]);

  return {
    // Estado
    query,
    results,
    suggestions,
    isLoading,
    error,
    totalResults,
    hasSearched,
    
    // Acciones
    setQuery,
    clearQuery,
    search,
    loadSuggestions,
    clearSuggestions,
    
    // Navegación
    navigateToSearch,
  };
}

/**
 * Hook para búsqueda en el header (búsqueda rápida)
 */
export function useHeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const loadSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/buscar/suggestions?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Error loading suggestions:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim() && isOpen) {
      debounceRef.current = setTimeout(() => {
        loadSuggestions(query);
      }, DEBOUNCE.SEARCH);
    } else {
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, isOpen, loadSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setSuggestions([]);
    }
  };

  const open = () => setIsOpen(true);
  const close = () => {
    setIsOpen(false);
    setQuery('');
    setSuggestions([]);
  };
  const toggle = () => setIsOpen(!isOpen);

  return {
    query,
    setQuery,
    isOpen,
    suggestions,
    isLoading,
    handleSubmit,
    open,
    close,
    toggle,
  };
}

export default useSearch;
