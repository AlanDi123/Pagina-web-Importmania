'use client';

import { useState, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { VariantManager } from '@/components/admin/VariantManager';
import { ProductWithRelations } from '@/types/product';
import { Category } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { Loader2, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().min(1, 'La descripción es requerida'),
  shortDescription: z.string().optional(),
  productType: z.enum(['PHYSICAL', 'DIGITAL']),
  price: z.coerce.number().positive('El precio debe ser mayor a 0'),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  costPrice: z.coerce.number().positive().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  stock: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(5),
  weight: z.coerce.number().positive().optional().nullable(),
  dimensions: z.object({
    length: z.coerce.number().optional(),
    width: z.coerce.number().optional(),
    height: z.coerce.number().optional(),
  }).optional().nullable(),
  digitalFileUrl: z.string().url().optional().nullable(),
  digitalFileSize: z.string().optional(),
  downloadLimit: z.coerce.number().int().optional().nullable(),
  downloadExpiry: z.coerce.number().int().optional().nullable(),
  categoryIds: z.array(z.string()),
  tags: z.array(z.string()),
  images: z.array(z.object({
    url: z.string(),
    alt: z.string().optional(),
    isMain: z.boolean(),
  })),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: ProductWithRelations;
  categories: Category[];
  mode: 'create' | 'edit';
  onSave?: () => void;
  onCancel?: () => void;
}

export function ProductForm({
  product,
  categories,
  mode,
  onSave,
  onCancel,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      sku: product?.sku || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      productType: product?.productType || 'PHYSICAL',
      price: product?.price.toNumber() || 0,
      compareAtPrice: product?.compareAtPrice?.toNumber() || null,
      costPrice: product?.costPrice?.toNumber() || null,
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      stock: product?.stock || 0,
      lowStockThreshold: product?.lowStockThreshold || 5,
      weight: product?.weight?.toNumber() || null,
      dimensions: product?.dimensions as any || null,
      digitalFileUrl: product?.digitalFileUrl || null,
      digitalFileSize: product?.digitalFileSize || '',
      downloadLimit: product?.downloadLimit || null,
      downloadExpiry: product?.downloadExpiry || null,
      categoryIds: product?.categories.map((c) => c.categoryId) || [],
      tags: product?.tags || [],
      images: product?.images.map((img) => ({
        url: img.url,
        alt: img.alt || '',
        isMain: img.isMain,
      })) || [],
      seoTitle: product?.seoTitle || '',
      seoDescription: product?.seoDescription || '',
    },
  });

  const productType = watch('productType');
  const images = watch('images');
  const tags = watch('tags');

  // Auto-generar slug desde el nombre
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'name' && !product?.slug) {
        const slug = value.name
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        setValue('slug', slug || '');
      }
      if (name === 'name' && !product?.sku) {
        const sku = value.name
          ?.substring(0, 3)
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, '') + '-' + Date.now();
        setValue('sku', sku);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue, product]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const url = mode === 'create' ? '/api/productos' : `/api/productos?id=${product?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al guardar');
      }

      toast.success(mode === 'create' ? 'Producto creado' : 'Producto actualizado');
      onSave?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!tags.includes(newTag)) {
        setValue('tags', [...tags, newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Precios</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="shipping">Envío</TabsTrigger>
          <TabsTrigger value="digital">Digital</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del producto</Label>
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" {...register('slug')} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" {...register('sku')} />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="productType"
                  checked={productType === 'DIGITAL'}
                  onCheckedChange={(checked) =>
                    setValue('productType', checked ? 'DIGITAL' : 'PHYSICAL')
                  }
                />
                <Label htmlFor="productType">Producto digital</Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="shortDescription">Descripción corta</Label>
                <Textarea
                  id="shortDescription"
                  {...register('shortDescription')}
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción completa</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  rows={6}
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch id="isActive" {...register('isActive')} />
                  <Label htmlFor="isActive">Activo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isFeatured" {...register('isFeatured')} />
                  <Label htmlFor="isFeatured">Destacado</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Precios */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input id="price" type="number" step="0.01" {...register('price')} />
                {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="compareAtPrice">Precio anterior (tachado)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  {...register('compareAtPrice')}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="costPrice">Precio de costo</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  {...register('costPrice')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventario */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock actual</Label>
                <Input id="stock" type="number" {...register('stock')} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lowStockThreshold">Umbral de stock bajo</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  {...register('lowStockThreshold')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Envío */}
        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {productType === 'PHYSICAL' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Peso (gramos)</Label>
                    <Input id="weight" type="number" {...register('weight')} />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="length">Largo (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        {...register('dimensions.length')}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="width">Ancho (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        {...register('dimensions.width')}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="height">Alto (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        {...register('dimensions.height')}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Digital */}
        <TabsContent value="digital" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {productType === 'DIGITAL' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="digitalFileUrl">URL del archivo</Label>
                    <Input id="digitalFileUrl" {...register('digitalFileUrl')} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="downloadLimit">Límite de descargas</Label>
                      <Input
                        id="downloadLimit"
                        type="number"
                        {...register('downloadLimit')}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="downloadExpiry">Expiración (horas)</Label>
                      <Input
                        id="downloadExpiry"
                        type="number"
                        {...register('downloadExpiry')}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categorías */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Categorías</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        checked={watch('categoryIds').includes(category.id)}
                        onCheckedChange={(checked) => {
                          const current = watch('categoryIds');
                          setValue(
                            'categoryIds',
                            checked
                              ? [...current, category.id]
                              : current.filter((id) => id !== category.id)
                          );
                        }}
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <Input
                  placeholder="Escribí un tag y presioná Enter"
                  onKeyDown={handleAddTag}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Imágenes */}
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ImageUploader
                images={images}
                onChange={(newImages) => setValue('images', newImages)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="seoTitle">Título SEO (máx 60 caracteres)</Label>
                <Input
                  id="seoTitle"
                  {...register('seoTitle')}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {watch('seoTitle')?.length || 0}/60
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="seoDescription">Meta descripción (máx 160 caracteres)</Label>
                <Textarea
                  id="seoDescription"
                  {...register('seoDescription')}
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {watch('seoDescription')?.length || 0}/160
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Variantes (si hay) */}
      {product && product.variants.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <VariantManager
              variants={product.variants}
              onChange={() => {}}
              parentSku={product.sku}
              parentPrice={product.price.toNumber()}
            />
          </CardContent>
        </Card>
      )}

      {/* Botones de acción */}
      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            mode === 'create' ? 'Crear producto' : 'Guardar cambios'
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
