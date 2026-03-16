'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { themeGlobalSettingsSchema, type ThemeGlobalSettings, type HomeSection } from '@/lib/validators';
import type { Media } from '@prisma/client';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import { Loader2, Palette, Monitor, Save, Upload, Image as ImageIcon, LayoutTemplate } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SectionManager } from '@/components/admin/SectionManager';

interface ThemeEditorClientProps {
  initialTheme: {
    id: string;
    name: string;
    isActive: boolean;
    globalSettings: ThemeGlobalSettings;
    createdAt: Date;
    updatedAt: Date;
  };
  availableMedia: Media[];
}

type ThemeFormData = {
  name: string;
} & ThemeGlobalSettings;

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Moderna)' },
  { value: 'Roboto', label: 'Roboto (Clásica)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegante)' },
  { value: 'Poppins', label: 'Poppins (Geométrica)' },
  { value: 'Open Sans', label: 'Open Sans (Legible)' },
  { value: 'Montserrat', label: 'Montserrat (Versátil)' },
  { value: 'Lato', label: 'Lato (Profesional)' },
];

export function ThemeEditorClient({
  initialTheme,
  availableMedia,
}: ThemeEditorClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false);
  const [homeSections, setHomeSections] = useState<HomeSection[]>(
    initialTheme.globalSettings.homeSections || []
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ThemeFormData>({
    resolver: zodResolver(
      z.object({
        name: z.string().min(1, 'El nombre del tema es requerido').max(100),
        ...themeGlobalSettingsSchema.shape,
      })
    ),
    defaultValues: {
      name: initialTheme.name,
      primaryColor: initialTheme.globalSettings.primaryColor,
      secondaryColor: initialTheme.globalSettings.secondaryColor,
      fontFamily: initialTheme.globalSettings.fontFamily,
      logoUrl: initialTheme.globalSettings.logoUrl,
      faviconUrl: initialTheme.globalSettings.faviconUrl || '',
      homeSections: initialTheme.globalSettings.homeSections || [],
    },
  });

  const watchedValues = watch();

  const handleUploadLogo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'store-assets');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir imagen');
      }

      // Registrar en Media
      const mediaResponse = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileUrl: data.url,
          fileType: file.type,
          size: file.size,
          altText: 'Logo de la tienda',
        }),
      });

      if (mediaResponse.ok) {
        setValue('logoUrl', data.url);
        toast.success('Logo subido correctamente');
      }
    } catch (error) {
      console.error('Error al subir logo:', error);
      toast.error('Error al subir el logo');
    }
  };

  const onSubmit = async (data: ThemeFormData) => {
    setIsSubmitting(true);

    try {
      const { name, ...globalSettings } = data;

      const response = await fetch('/api/admin/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          isActive: true,
          globalSettings: {
            ...globalSettings,
            homeSections,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar el tema');
      }

      toast.success('Tema guardado correctamente');
    } catch (error) {
      console.error('Error al guardar tema:', error);
      toast.error('Error al guardar el tema');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Panel de Edición */}
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Configuración del Tema
                  </CardTitle>
                  <CardDescription>
                    Personaliza los elementos visuales de tu tienda
                  </CardDescription>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar Cambios
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="colors">Colores</TabsTrigger>
                  <TabsTrigger value="typography">Tipografía</TabsTrigger>
                  <TabsTrigger value="sections">
                    <LayoutTemplate className="h-4 w-4 mr-1" />
                    Secciones
                  </TabsTrigger>
                </TabsList>

                {/* Tab General */}
                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Tema</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Tema Principal"
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Logo de la Tienda</Label>
                    <div className="flex items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <Input
                          {...register('logoUrl')}
                          placeholder="https://ejemplo.com/logo.png"
                          className="font-mono text-sm"
                        />
                        {errors.logoUrl && (
                          <p className="text-sm text-destructive">{errors.logoUrl.message}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Dialog open={isMediaDialogOpen} onOpenChange={setIsMediaDialogOpen}>
                          <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm" className="gap-2">
                              <ImageIcon className="h-4 w-4" />
                              Biblioteca
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Biblioteca de Medios</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-4 max-h-96 overflow-auto">
                              {availableMedia.map((media) => (
                                <button
                                  key={media.id}
                                  type="button"
                                  onClick={() => {
                                    setValue('logoUrl', media.fileUrl);
                                    setIsMediaDialogOpen(false);
                                  }}
                                  className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-colors ${
                                    watchedValues.logoUrl === media.fileUrl
                                      ? 'border-primary'
                                      : 'border-transparent hover:border-muted-foreground'
                                  }`}
                                >
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={media.fileUrl}
                                    alt={media.altText || media.fileName}
                                    className="h-full w-full object-cover"
                                  />
                                </button>
                              ))}
                              {availableMedia.length === 0 && (
                                <p className="col-span-3 text-center text-muted-foreground py-8">
                                  No hay medios subidos
                                </p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <label>
                          <Button type="button" variant="outline" size="sm" className="gap-2" asChild>
                            <span>
                              <Upload className="h-4 w-4" />
                              Subir
                            </span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadLogo}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    {watchedValues.logoUrl && (
                      <div className="mt-2 p-2 border rounded-md bg-muted/50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={watchedValues.logoUrl}
                          alt="Logo preview"
                          className="h-12 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="faviconUrl">Favicon (opcional)</Label>
                    <Input
                      id="faviconUrl"
                      {...register('faviconUrl')}
                      placeholder="https://ejemplo.com/favicon.ico"
                      className="font-mono text-sm"
                    />
                    {errors.faviconUrl && (
                      <p className="text-sm text-destructive">{errors.faviconUrl.message}</p>
                    )}
                  </div>
                </TabsContent>

                {/* Tab Colors */}
                <TabsContent value="colors" className="space-y-4 mt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Color Primario</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          {...register('primaryColor')}
                          className="w-16 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={watchedValues.primaryColor}
                          onChange={(e) => setValue('primaryColor', e.target.value)}
                          className="font-mono uppercase"
                          placeholder="#000000"
                        />
                      </div>
                      {errors.primaryColor && (
                        <p className="text-sm text-destructive">{errors.primaryColor.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Color Secundario</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          type="color"
                          {...register('secondaryColor')}
                          className="w-16 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={watchedValues.secondaryColor}
                          onChange={(e) => setValue('secondaryColor', e.target.value)}
                          className="font-mono uppercase"
                          placeholder="#6b7280"
                        />
                      </div>
                      {errors.secondaryColor && (
                        <p className="text-sm text-destructive">{errors.secondaryColor.message}</p>
                      )}
                    </div>
                  </div>

                  <Card className="border-dashed">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-3">Vista previa de colores:</p>
                      <div className="flex gap-4">
                        <div
                          className="h-16 flex-1 rounded-md flex items-center justify-center text-sm font-medium text-white"
                          style={{ backgroundColor: watchedValues.primaryColor }}
                        >
                          Primario
                        </div>
                        <div
                          className="h-16 flex-1 rounded-md flex items-center justify-center text-sm font-medium text-white"
                          style={{ backgroundColor: watchedValues.secondaryColor }}
                        >
                          Secundario
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Typography */}
                <TabsContent value="typography" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily">Familia Tipográfica</Label>
                    <Select
                      value={watchedValues.fontFamily}
                      onValueChange={(value) => setValue('fontFamily', value)}
                    >
                      <SelectTrigger id="fontFamily">
                        <SelectValue placeholder="Selecciona una fuente" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map((font) => (
                          <SelectItem
                            key={font.value}
                            value={font.value}
                            style={{ fontFamily: font.value }}
                          >
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fontFamily && (
                      <p className="text-sm text-destructive">{errors.fontFamily.message}</p>
                    )}
                  </div>

                  <Card className="border-dashed">
                    <CardContent className="pt-4">
                      <p className="text-sm text-muted-foreground mb-3">Vista previa de tipografía:</p>
                      <div
                        className="space-y-2 p-4 border rounded-md bg-muted/50"
                        style={{ fontFamily: watchedValues.fontFamily }}
                      >
                        <h3 className="text-xl font-bold">Título de ejemplo</h3>
                        <p className="text-sm">
                          Este es un texto de ejemplo para visualizar cómo se verá la tipografía
                          seleccionada en tu tienda. La legibilidad y el estilo son importantes
                          para la experiencia del usuario.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Tab Sections */}
                <TabsContent value="sections" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <SectionManager
                        sections={homeSections}
                        onSectionsChange={setHomeSections}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </form>
      </div>

      {/* Panel de Preview */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Vista Previa
                </CardTitle>
                <CardDescription>
                  Visualiza los cambios en tiempo real
                </CardDescription>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12" y2="18" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`border rounded-lg overflow-hidden bg-white transition-all duration-300 ${
                previewMode === 'mobile'
                  ? 'max-w-[280px] mx-auto'
                  : 'w-full'
              }`}
              style={{
                fontFamily: watchedValues.fontFamily,
              }}
            >
              {/* Header Preview */}
              <div
                className="p-4 text-white"
                style={{ backgroundColor: watchedValues.primaryColor }}
              >
                <div className="flex items-center justify-between">
                  {watchedValues.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={watchedValues.logoUrl}
                      alt="Logo"
                      className="h-8 object-contain"
                    />
                  ) : (
                    <span className="font-bold text-lg">Tu Tienda</span>
                  )}
                  <nav className="hidden sm:flex gap-4 text-sm">
                    <span>Inicio</span>
                    <span>Productos</span>
                    <span>Contacto</span>
                  </nav>
                </div>
              </div>

              {/* Hero Preview */}
              <div className="p-6 text-center">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: watchedValues.primaryColor }}
                >
                  Bienvenido
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  Descubre nuestros productos
                </p>
                <button
                  className="px-6 py-2 rounded-md text-white font-medium text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: watchedValues.secondaryColor }}
                >
                  Ver Productos
                </button>
              </div>

              {/* Product Cards Preview */}
              <div className="p-4 grid grid-cols-2 gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="border rounded-lg p-3 space-y-2">
                    <div className="aspect-square bg-muted rounded-md" />
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div
                        className="h-3 rounded w-1/4"
                        style={{ backgroundColor: `${watchedValues.primaryColor}40` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Preview */}
              <div
                className="p-4 text-white text-center text-xs"
                style={{ backgroundColor: watchedValues.primaryColor }}
              >
                © 2024 Tu Tienda. Todos los derechos reservados.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Cambios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resumen</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Color Primario:</span>
              <span className="font-mono">{watchedValues.primaryColor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Color Secundario:</span>
              <span className="font-mono">{watchedValues.secondaryColor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipografía:</span>
              <span>{watchedValues.fontFamily}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Logo:</span>
              <span className="truncate max-w-[150px]">
                {watchedValues.logoUrl ? 'Configurado' : 'No configurado'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
