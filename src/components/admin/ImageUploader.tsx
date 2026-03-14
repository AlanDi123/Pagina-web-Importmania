'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Upload, X, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface Image {
  url: string;
  alt?: string;
  isMain: boolean;
}

interface ImageUploaderProps {
  images: Image[];
  onChange: (images: Image[]) => void;
  bucket?: string;
}

export function ImageUploader({
  images,
  onChange,
  bucket = 'products',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validar tipo de archivo
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          throw new Error('Solo se permiten imágenes JPG, PNG o WebP');
        }

        // Validar tamaño (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error('Las imágenes deben pesar menos de 5MB');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al subir imagen');
        }

        const data = await response.json();
        return {
          url: data.url,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          isMain: images.length === 0, // Primera imagen es principal
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedImages]);
      toast.success('Imágenes subidas correctamente');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al subir imágenes');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );

  const handleSetMain = (index: number) => {
    onChange(
      images.map((img, i) => ({
        ...img,
        isMain: i === index,
      }))
    );
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newImages.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          dragActive
            ? 'border-brand-primary bg-brand-primary/5'
            : 'border-muted-foreground/25 hover:border-brand-primary/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={isUploading}
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
            <div>
              <p className="font-medium">
                {isUploading ? 'Subiendo...' : 'Arrastrá imágenes aquí'}
              </p>
              <p className="text-sm text-muted-foreground">
                o hacé clic para seleccionar (JPG, PNG, WebP - máx 5MB)
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Imágenes subidas */}
      {images.length > 0 && (
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  'relative group aspect-square rounded-lg overflow-hidden border',
                  image.isMain && 'border-brand-primary ring-2 ring-brand-primary/20'
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt || 'Imagen'}
                  fill
                  className="object-cover"
                  sizes="150px"
                />

                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => handleSetMain(index)}
                    title="Marcar como principal"
                  >
                    <Star
                      className={cn(
                        'h-4 w-4',
                        image.isMain && 'fill-yellow-500 text-yellow-500'
                      )}
                    />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => handleMove(index, 'up')}
                    disabled={index === 0}
                    title="Mover arriba"
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => handleMove(index, 'down')}
                    disabled={index === images.length - 1}
                    title="Mover abajo"
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleRemove(index)}
                    title="Eliminar"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Badge de imagen principal */}
                {image.isMain && (
                  <Badge className="absolute top-1 left-1 bg-brand-primary">
                    Principal
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default ImageUploader;
