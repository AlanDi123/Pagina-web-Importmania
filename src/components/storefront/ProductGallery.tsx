'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  isMain: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(
    images.find((img) => img.isMain) || images[0] || null
  );
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Manejar zoom on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;

    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">Sin imagen</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div
        ref={mainImageRef}
        className="relative aspect-square overflow-hidden rounded-lg bg-muted cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
      >
        <Image
          src={selectedImage?.url || images[0].url}
          alt={selectedImage?.alt || images[0].alt || 'Producto'}
          fill
          className="object-cover transition-transform duration-300"
          style={zoomStyle}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <ScrollArea className="w-full">
          <div className="flex gap-2">
            {images.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className={cn(
                  'relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors',
                  selectedImage?.id === image.id
                    ? 'border-brand-primary'
                    : 'border-transparent hover:border-muted-foreground'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || 'Thumbnail'}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <ScrollArea className="max-h-[90vh]" type="auto">
            <div className="relative aspect-square">
              <Image
                src={selectedImage?.url || images[0].url}
                alt={selectedImage?.alt || images[0].alt || 'Producto'}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProductGallery;
