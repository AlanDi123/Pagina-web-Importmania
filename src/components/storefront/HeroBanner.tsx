'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  image: string;
  imageMobile?: string;
  backgroundColor?: string;
}

interface HeroBannerProps {
  slides?: HeroSlide[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function HeroBanner({
  slides = [],
  autoPlay = true,
  autoPlayInterval = 5000,
  className,
}: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Slides de ejemplo si no se proporcionan
  const defaultSlides: HeroSlide[] = [
    {
      id: '1',
      title: 'Productos Importados de Calidad',
      subtitle: 'Envíos a todo el país',
      description: 'Descubrí nuestra selección de productos importados con los mejores precios del mercado.',
      ctaText: 'Ver productos',
      ctaLink: '/productos',
      image: 'https://placehold.co/1920x600/00BFFF/white?text=Productos+Importados',
      backgroundColor: 'bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20',
    },
    {
      id: '2',
      title: '¡Envío Gratis!',
      subtitle: 'En compras superiores a $50.000',
      description: 'Aprovechá nuestros envíos gratis a todo el país en pedidos que superen los $50.000.',
      ctaText: 'Comprar ahora',
      ctaLink: '/productos',
      image: 'https://placehold.co/1920x600/2ECC71/white?text=Envio+Gratis',
      backgroundColor: 'bg-gradient-to-r from-brand-accent/20 to-brand-primary/20',
    },
    {
      id: '3',
      title: 'Nuevos Productos Cada Semana',
      subtitle: 'Siempre hay algo nuevo',
      description: 'Sumate al newsletter y enterate primero de nuestros lanzamientos.',
      ctaText: 'Ver novedades',
      ctaLink: '/productos?sort=newest',
      image: 'https://placehold.co/1920x600/FF8C00/white?text=Nuevos+Productos',
      backgroundColor: 'bg-gradient-to-r from-brand-secondary/20 to-brand-accent/20',
    },
  ];

  const heroSlides = slides.length > 0 ? slides : defaultSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, isPaused, nextSlide]);

  if (heroSlides.length === 0) {
    return null;
  }

  return (
    <section
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px]">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            {/* Background */}
            <div className={cn('absolute inset-0', slide.backgroundColor || 'bg-gray-100 dark:bg-gray-800')}>
              {/* Imagen de fondo opcional */}
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-50"
                  priority={index === 0}
                  sizes="100vw"
                  unoptimized
                />
              )}
            </div>

            {/* Contenido */}
            <div className="relative h-full container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="max-w-2xl space-y-4 sm:space-y-6 animate-fade-in">
                {slide.subtitle && (
                  <p className="text-sm sm:text-base font-medium text-brand-primary uppercase tracking-wider">
                    {slide.subtitle}
                  </p>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-text-primary leading-tight">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-base sm:text-lg text-text-secondary max-w-xl">
                    {slide.description}
                  </p>
                )}
                {slide.ctaLink && (
                  <Link href={slide.ctaLink}>
                    <Button size="lg" className="mt-4">
                      {slide.ctaText || 'Ver más'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación */}
      {heroSlides.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-gray-800/80 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 dark:bg-gray-800/80 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentSlide
                    ? 'w-8 bg-brand-primary'
                    : 'bg-gray-400 hover:bg-gray-500'
                )}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default HeroBanner;
