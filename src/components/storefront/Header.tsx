'use client';

import { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X, Package, Folder } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useHeaderSearch } from '@/hooks/useSearch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/storefront/ThemeToggle';
import { cn } from '@/lib/utils';
import { formatARS } from '@/lib/formatters';

interface HeaderProps {
  logo?: string;
  categories?: Array<{ id: string; name: string; slug: string }>;
}

// Componente memoizado para el logo
const Logo = memo(({ logo }: { logo?: string }) => (
  <Link href="/" className="flex-shrink-0">
    {logo ? (
      <Image
        src={logo}
        alt="iMPORTMANIA"
        width={180}
        height={60}
        className="h-10 w-auto object-contain"
        priority
        loading="eager"
      />
    ) : (
      <h1 className="text-xl sm:text-2xl font-bold text-brand-primary">
        iMPORTMANIA
      </h1>
    )}
  </Link>
));
Logo.displayName = 'Logo';

// Componente memoizado para acciones
const ActionButtons = memo(({ 
  itemsCount, 
  wishlistCount, 
  isAuthenticated,
  toggleCart,
}: { 
  itemsCount: number;
  wishlistCount: number;
  isAuthenticated: boolean;
  toggleCart: () => void;
}) => (
  <>
    {/* Wishlist */}
    <Link href={isAuthenticated ? '/cuenta/favoritos' : '/login'}>
      <Button variant="ghost" size="icon" className="relative">
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-primary text-[10px] font-bold text-white flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </Button>
    </Link>

    {/* Carrito */}
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleCart}
      className="relative"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemsCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-brand-primary text-[10px] font-bold text-white flex items-center justify-center">
          {itemsCount}
        </span>
      )}
    </Button>

    {/* Usuario */}
    <Link href={isAuthenticated ? '/cuenta' : '/login'}>
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5" />
      </Button>
    </Link>

    {/* Theme toggle */}
    <ThemeToggle />
  </>
));
ActionButtons.displayName = 'ActionButtons';

export function Header({ logo, categories = [] }: HeaderProps) {
  const router = useRouter();
  const { itemsCount, toggleCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { isSearchOpen, toggleSearch, searchQuery, setSearchQuery } = useUI();
  const {
    query,
    setQuery,
    isOpen,
    suggestions,
    isLoading,
    handleSubmit,
    open,
    close,
  } = useHeaderSearch();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoizar categorías para evitar re-renders
  const categoryLinks = useMemo(() => categories, [categories]);

  // Detectar scroll para header sticky - optimizado con requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [close]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (!isOpen && value.length >= 2) {
      open();
    }
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    if (suggestion.type === 'product') {
      router.push(`/productos/${suggestion.slug}`);
    } else if (suggestion.type === 'category') {
      router.push(`/categorias/${suggestion.slug}`);
    }
    close();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(query)}`);
      close();
    }
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      close();
    }, 150);
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    if (query.length >= 2) {
      open();
    }
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow',
        isScrolled && 'shadow-md'
      )}
    >
      {/* Barra superior */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo - Componente memoizado */}
          <Logo logo={logo} />

          {/* Menú Desktop (NUEVO) */}
          <nav className="hidden md:flex items-center gap-6 mx-6">
            <Link href="/productos" className="text-sm font-medium text-text-primary hover:text-brand-primary transition-colors">
              Productos
            </Link>
            {categories.slice(0, 4).map((category) => (
              <Link 
                key={category.id} 
                href={`/categorias/${category.slug}`}
                className="text-sm font-medium text-text-primary hover:text-brand-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Barra de búsqueda (desktop) */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-auto relative">
            <div className="relative w-full" ref={dropdownRef}>
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="pr-10"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-primary"
              >
                <Search className="h-4 w-4" />
              </button>

              {/* Dropdown de sugerencias */}
              {isOpen && query.length >= 2 && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {isLoading && (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Buscando...
                    </div>
                  )}
                  {!isLoading && (
                    <ul className="py-2">
                      {suggestions.slice(0, 5).map((suggestion) => (
                        <li
                          key={suggestion.id}
                          className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center gap-3"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.type === 'product' ? (
                            <>
                              <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{suggestion.name}</p>
                                {suggestion.price && (
                                  <p className="text-xs text-muted-foreground">{formatARS(suggestion.price)}</p>
                                )}
                              </div>
                              {suggestion.image && (
                                <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                  <Image
                                    src={suggestion.image}
                                    alt={suggestion.name}
                                    width={40}
                                    height={40}
                                    className="object-cover"
                                  />
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <Folder className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm font-medium">{suggestion.name}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Acciones */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Toggle búsqueda mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Botones de acción - Componente memoizado */}
            <ActionButtons 
              itemsCount={itemsCount}
              wishlistCount={wishlistCount}
              isAuthenticated={isAuthenticated}
              toggleCart={toggleCart}
            />

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda mobile */}
        {isSearchOpen && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/buscar?q=${encodeURIComponent(searchQuery)}`);
                setSearchQuery('');
              }
            }} 
            className="md:hidden pb-4"
          >
            <div className="relative">
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-primary"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Menú móvil - Optimizado con useMemo */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container mx-auto max-w-7xl px-4 py-4 space-y-2">
            <Link
              href="/productos"
              className="block py-2 text-text-primary hover:text-brand-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Productos
            </Link>
            {categoryLinks.map((category) => (
              <Link
                key={category.id}
                href={`/categorias/${category.slug}`}
                className="block py-2 text-text-primary hover:text-brand-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/blog"
              className="block py-2 text-text-primary hover:text-brand-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// Exportar componente memoizado por defecto
export default memo(Header);
