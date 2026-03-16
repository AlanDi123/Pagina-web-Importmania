'use client';

import { useState } from 'react';
import type { HomeSection, SectionType } from '@/lib/validators';
import { SECTION_TYPES } from '@/lib/validators';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  LayoutTemplate,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface SectionManagerProps {
  sections: HomeSection[];
  onSectionsChange: (sections: HomeSection[]) => void;
}

const SECTION_LABELS: Record<SectionType, string> = {
  HERO_BANNER: 'Banner Principal (Hero)',
  FEATURED_PRODUCTS: 'Productos Destacados',
  NEW_PRODUCTS: 'Nuevos Productos',
  CATEGORIES: 'Categorías',
  TEXT_BLOCK: 'Bloque de Texto',
  IMAGE_BANNER: 'Banner de Imagen',
  NEWSLETTER: 'Newsletter',
};

const DEFAULT_PROPS_BY_TYPE: Record<SectionType, Record<string, unknown>> = {
  HERO_BANNER: {
    title: 'Bienvenido a nuestra tienda',
    subtitle: 'Descubrí nuestros productos',
    buttonText: 'Ver Productos',
    buttonLink: '/productos',
  },
  FEATURED_PRODUCTS: {
    title: 'Productos Destacados',
    productsCount: 8,
    showRating: true,
  },
  NEW_PRODUCTS: {
    title: 'Nuevos Productos',
    productsCount: 8,
    showRating: true,
  },
  CATEGORIES: {
    title: 'Categorías',
    categoriesCount: 8,
  },
  TEXT_BLOCK: {
    title: 'Sobre Nosotros',
    content: '<p>Escribí aquí tu contenido...</p>',
    textAlign: 'center' as const,
  },
  IMAGE_BANNER: {
    image: 'https://placehold.co/1200x400',
    alt: 'Banner',
    height: '400px',
  },
  NEWSLETTER: {
    title: 'Suscribite al Newsletter',
    description: 'Recibí novedades y promociones exclusivas',
  },
};

export function SectionManager({ sections, onSectionsChange }: SectionManagerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const addSection = (type: SectionType) => {
    const newSection: HomeSection = {
      id: `section-${Date.now()}`,
      type,
      order: sections.length,
      isVisible: true,
      props: { ...DEFAULT_PROPS_BY_TYPE[type] },
    };

    onSectionsChange([...sections, newSection]);
    setExpandedSection(newSection.id);
    toast.success(`Sección "${SECTION_LABELS[type]}" agregada`);
  };

  const removeSection = (id: string) => {
    onSectionsChange(sections.filter((s) => s.id !== id));
    toast.success('Sección eliminada');
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= newSections.length) return;

    // Intercambiar orden
    const currentSection = newSections[index];
    const targetSection = newSections[newIndex];

    if (!currentSection || !targetSection) return;

    const temp = currentSection.order;
    currentSection.order = targetSection.order;
    targetSection.order = temp;

    // Reordenar array
    newSections.sort((a, b) => a.order - b.order);
    onSectionsChange(newSections);
  };

  const toggleVisibility = (id: string) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === id ? { ...s, isVisible: !s.isVisible } : s
      )
    );
  };

  const updateSectionProps = (id: string, props: Record<string, unknown>) => {
    onSectionsChange(
      sections.map((s) =>
        s.id === id ? { ...s, props: { ...s.props, ...props } } : s
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5" />
            Secciones de la Home
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Agregá, reordená y configurá las secciones de tu página de inicio
          </p>
        </div>
      </div>

      {/* Lista de secciones */}
      <Accordion
        type="single"
        collapsible
        value={expandedSection || undefined}
        onValueChange={setExpandedSection}
        className="space-y-4"
      >
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <AccordionItem value={section.id} key={section.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{SECTION_LABELS[section.type]}</span>
                    {!section.isVisible && (
                      <span className="text-xs text-muted-foreground">(Oculto)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.preventDefault()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleVisibility(section.id)}
                    >
                      {section.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => removeSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <SectionConfigForm
                  key={section.id}
                  section={section}
                  onUpdateProps={(props) => updateSectionProps(section.id, props)}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>

      {sections.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay secciones configuradas. Agregá una para comenzar.
          </CardContent>
        </Card>
      )}

      {/* Botones para agregar secciones */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Agregar Sección</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {(Object.keys(SECTION_TYPES) as SectionType[]).map((type) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              className="h-auto py-3 px-2 flex flex-col items-center gap-1"
              onClick={() => addSection(type)}
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">{SECTION_LABELS[type]}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SectionConfigFormProps {
  section: HomeSection;
  onUpdateProps: (props: Record<string, unknown>) => void;
}

function SectionConfigForm({ section, onUpdateProps }: SectionConfigFormProps) {
  const props = section.props as Record<string, unknown>;

  const handleTextChange = (key: string, value: string) => {
    onUpdateProps({ [key]: value });
  };

  const handleNumberChange = (key: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      onUpdateProps({ [key]: num });
    }
  };

  const handleBooleanChange = (key: string, value: boolean) => {
    onUpdateProps({ [key]: value });
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Campos comunes según tipo */}
      {props.title !== undefined && (
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={props.title as string}
            onChange={(e) => handleTextChange('title', e.target.value)}
          />
        </div>
      )}

      {props.subtitle !== undefined && (
        <div className="space-y-2">
          <Label>Subtítulo</Label>
          <Input
            value={props.subtitle as string}
            onChange={(e) => handleTextChange('subtitle', e.target.value)}
          />
        </div>
      )}

      {props.content !== undefined && (
        <div className="space-y-2">
          <Label>Contenido (HTML)</Label>
          <textarea
            value={props.content as string}
            onChange={(e) => handleTextChange('content', e.target.value)}
            className="w-full min-h-[120px] p-2 border rounded-md font-mono text-sm"
          />
        </div>
      )}

      {props.buttonText !== undefined && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Texto del Botón</Label>
            <Input
              value={props.buttonText as string}
              onChange={(e) => handleTextChange('buttonText', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Link del Botón</Label>
            <Input
              value={props.buttonLink as string}
              onChange={(e) => handleTextChange('buttonLink', e.target.value)}
            />
          </div>
        </div>
      )}

      {props.backgroundImage !== undefined && (
        <div className="space-y-2">
          <Label>Imagen de Fondo (URL)</Label>
          <Input
            value={props.backgroundImage as string}
            onChange={(e) => handleTextChange('backgroundImage', e.target.value)}
            placeholder="https://..."
          />
        </div>
      )}

      {props.image !== undefined && (
        <div className="space-y-2">
          <Label>Imagen (URL)</Label>
          <Input
            value={props.image as string}
            onChange={(e) => handleTextChange('image', e.target.value)}
            placeholder="https://..."
          />
        </div>
      )}

      {props.productsCount !== undefined && (
        <div className="space-y-2">
          <Label>Cantidad de Productos</Label>
          <Input
            type="number"
            min="1"
            max="20"
            value={props.productsCount as number}
            onChange={(e) => handleNumberChange('productsCount', e.target.value)}
          />
        </div>
      )}

      {props.categoriesCount !== undefined && (
        <div className="space-y-2">
          <Label>Cantidad de Categorías</Label>
          <Input
            type="number"
            min="1"
            max="12"
            value={props.categoriesCount as number}
            onChange={(e) => handleNumberChange('categoriesCount', e.target.value)}
          />
        </div>
      )}

      {props.showRating !== undefined && (
        <div className="flex items-center justify-between">
          <Label>Mostrar Valoraciones</Label>
          <Switch
            checked={props.showRating as boolean}
            onCheckedChange={(checked) => handleBooleanChange('showRating', checked)}
          />
        </div>
      )}

      {props.textAlign !== undefined && (
        <div className="space-y-2">
          <Label>Alineación del Texto</Label>
          <Select
            value={props.textAlign as string}
            onValueChange={(value) => handleTextChange('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Izquierda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Derecha</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {props.height !== undefined && (
        <div className="space-y-2">
          <Label>Altura</Label>
          <Input
            value={props.height as string}
            onChange={(e) => handleTextChange('height', e.target.value)}
            placeholder="400px"
          />
        </div>
      )}

      {props.description !== undefined && (
        <div className="space-y-2">
          <Label>Descripción</Label>
          <Input
            value={props.description as string}
            onChange={(e) => handleTextChange('description', e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
