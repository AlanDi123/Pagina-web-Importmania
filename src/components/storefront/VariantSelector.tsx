'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VariantOption {
  name: string;
  values: string[];
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number | null;
  stock: number;
  isActive: boolean;
  options: Record<string, string>;
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange: (variant: ProductVariant | null) => void;
  selectedVariant?: ProductVariant | null;
  basePrice: number;
}

export function VariantSelector({
  variants,
  onVariantChange,
  selectedVariant,
  basePrice,
}: VariantSelectorProps) {
  // Extraer atributos únicos de las variantes
  const variantOptions = useMemo(() => {
    if (!variants || variants.length === 0) return [];

    const options: Record<string, Set<string>> = {};

    variants.forEach((variant) => {
      Object.entries(variant.options).forEach(([key, value]) => {
        if (!options[key]) {
          options[key] = new Set();
        }
        options[key].add(value);
      });
    });

    return Object.entries(options).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [variants]);

  // Estado de selección actual
  const selectedOptions = useMemo(() => {
    if (!selectedVariant) return {};
    return selectedVariant.options;
  }, [selectedVariant]);

  // Encontrar variante que matchea con las opciones seleccionadas
  const findMatchingVariant = (options: Record<string, string>) => {
    return variants.find((variant) => {
      return Object.entries(options).every(
        ([key, value]) => variant.options[key] === value
      );
    });
  };

  // Verificar si una combinación de opciones es válida
  const isOptionAvailable = (optionName: string, optionValue: string) => {
    const testOptions = { ...selectedOptions, [optionName]: optionValue };
    const variant = findMatchingVariant(testOptions);
    return variant && variant.isActive && variant.stock > 0;
  };

  // Manejar selección de opción
  const handleOptionSelect = (optionName: string, value: string) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    const variant = findMatchingVariant(newOptions);
    onVariantChange(variant || null);
  };

  // Calcular precio
  const displayPrice = selectedVariant?.price || basePrice;

  if (!variants || variants.length === 0) {
    return null;
  }

  // Verificar si hay stock
  const isOutOfStock = selectedVariant
    ? selectedVariant.stock === 0 || !selectedVariant.isActive
    : false;

  return (
    <div className="space-y-4">
      {/* Opciones de variantes */}
      {variantOptions.map((option) => (
        <div key={option.name}>
          <label className="text-sm font-medium mb-2 block">{option.name}</label>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value;
              const isAvailable = isOptionAvailable(option.name, value);
              const isColorOption = option.name.toLowerCase() === 'color';

              if (isColorOption) {
                return (
                  <button
                    key={value}
                    onClick={() => handleOptionSelect(option.name, value)}
                    disabled={!isAvailable}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all',
                      isSelected ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-muted-foreground/20',
                      !isAvailable && 'opacity-30 cursor-not-allowed'
                    )}
                    style={{
                      backgroundColor: isValidCSSColor(value) ? value : undefined,
                      backgroundImage: !isValidCSSColor(value) ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : undefined,
                      backgroundSize: '8px 8px',
                      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                    }}
                    title={value}
                  />
                );
              }

              return (
                <Button
                  key={value}
                  type="button"
                  variant={isSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleOptionSelect(option.name, value)}
                  disabled={!isAvailable}
                  className={cn(
                    !isAvailable && 'opacity-30 cursor-not-allowed'
                  )}
                >
                  {value}
                </Button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Precio y stock */}
      {selectedVariant && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${displayPrice.toLocaleString('es-AR')}</p>
              {isOutOfStock ? (
                <p className="text-red-500 text-sm">Sin stock</p>
              ) : (
                <p className="text-green-600 text-sm">
                  {selectedVariant.stock} unidades disponibles
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              SKU: {selectedVariant.sku}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper para verificar si un string es un color CSS válido
function isValidCSSColor(color: string): boolean {
  const validColors = [
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white',
    'gray', 'grey', 'brown', 'navy', 'teal', 'cyan', 'magenta', 'lime', 'olive',
    'maroon', 'silver', 'gold', 'coral', 'salmon', 'tomato', 'crimson', 'indigo',
    'violet', 'turquoise', 'beige', 'ivory', 'khaki', 'lavender', 'plum', 'tan',
  ];
  return (
    validColors.includes(color.toLowerCase()) ||
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) ||
    /^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$/.test(color) ||
    /^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, [\d.]+\)$/.test(color)
  );
}

export default VariantSelector;
