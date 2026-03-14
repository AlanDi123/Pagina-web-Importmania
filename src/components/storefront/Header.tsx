'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/storefront/ThemeToggle';
import { cn } from '@/lib/utils';

interface HeaderProps {
  logo?: string;
  categories?: Array<{ id: string; name: string; slug: string }>;
}

export function Header({ logo, categories = [] }: HeaderProps) {
  const pathname = usePathname();
  const { cart, itemsCount, toggleCart } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { isSearchOpen, toggleSearch, searchQuery, setSearchQuery } = useUI();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detectar scroll para header sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
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
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            {logo ? (
              <Image
                src={logo}
                alt="iMPORTMANIA"
                width={180}
                height={60}
                className="h-10 w-auto object-contain"
                priority
              />
            ) : (
              <h1 className="text-xl sm:text-2xl font-bold text-brand-primary">
                iMPORTMANIA
              </h1>
            )}
          </Link>

          {/* Barra de búsqueda (desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-auto">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-brand-primary"
              >
                <Search className="h-4 w-4" />
              </button>
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
          <form onSubmit={handleSearch} className="md:hidden pb-4">
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

      {/* Menú móvil */}
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
            {categories.map((category) => (
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

export default Header;
