'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Category } from '@prisma/client';
import { toast } from 'react-hot-toast';

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url().optional().nullable(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: CategoryFormData) => void;
}

export function CategoryForm({
  category,
  categories,
  open,
  onOpenChange,
  onSave,
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<Array<{ url: string; alt?: string; isMain: boolean }>>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      image: category?.image || null,
      parentId: category?.parentId || null,
      sortOrder: category?.sortOrder || 0,
      isActive: category?.isActive ?? true,
      seoTitle: category?.seoTitle || '',
      seoDescription: category?.seoDescription || '',
    },
  });

  useEffect(() => {
    if (category?.image) {
      setImages([{ url: category.image, alt: category.name, isMain: true }]);
    }
  }, [category]);

  // Auto-generar slug
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'name' && !category?.slug) {
        const slug = value.name
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        setValue('slug', slug || '');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, category]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);

    try {
      // Actualizar imagen desde el uploader
      const imageData = {
        ...data,
        image: images[0]?.url || null,
      };

      onSave(imageData);
      toast.success(category ? 'Categoría actualizada' : 'Categoría creada');
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrar categorías para el select (excluir la actual y sus hijos)
  const parentCategories = categories.filter(
    (c) => c.id !== category?.id && c.parentId === null
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar categoría' : 'Nueva categoría'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" {...register('slug')} />
            </div>

            {/* Descripción */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" {...register('description')} rows={3} />
            </div>

            {/* Imagen */}
            <div className="grid gap-2">
              <Label>Imagen</Label>
              <ImageUploader
                images={images}
                onChange={setImages}
                bucket="categories"
              />
            </div>

            {/* Categoría padre */}
            <div className="grid gap-2">
              <Label htmlFor="parentId">Categoría padre (opcional)</Label>
              <Select
                value={watch('parentId') || ''}
                onValueChange={(value) => setValue('parentId', value || null)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin categoría padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin categoría padre</SelectItem>
                  {parentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Orden */}
            <div className="grid gap-2">
              <Label htmlFor="sortOrder">Orden de visualización</Label>
              <Input
                id="sortOrder"
                type="number"
                {...register('sortOrder')}
              />
            </div>

            {/* Activo */}
            <div className="flex items-center space-x-2">
              <Switch id="isActive" {...register('isActive')} />
              <Label htmlFor="isActive">Activo</Label>
            </div>

            {/* SEO */}
            <div className="border-t pt-4 space-y-4">
              <h4 className="font-medium">SEO</h4>
              <div className="grid gap-2">
                <Label htmlFor="seoTitle">Título SEO</Label>
                <Input
                  id="seoTitle"
                  {...register('seoTitle')}
                  maxLength={60}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="seoDescription">Meta descripción</Label>
                <Textarea
                  id="seoDescription"
                  {...register('seoDescription')}
                  rows={2}
                  maxLength={160}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CategoryForm;
