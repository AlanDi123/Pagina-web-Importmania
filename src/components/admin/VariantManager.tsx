'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ProductVariant } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { Plus, X, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VariantManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  parentSku: string;
  parentPrice: number;
}

interface AttributeDefinition {
  name: string;
  values: string[];
}

export function VariantManager({
  variants,
  onChange,
  parentSku,
  parentPrice,
}: VariantManagerProps) {
  const [attributes, setAttributes] = useState<AttributeDefinition[]>([]);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeValues, setNewAttributeValues] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Agregar atributo
  const handleAddAttribute = () => {
    if (!newAttributeName.trim() || !newAttributeValues.trim()) return;

    const values = newAttributeValues
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    setAttributes([...attributes, { name: newAttributeName.trim(), values }]);
    setNewAttributeName('');
    setNewAttributeValues('');
  };

  // Eliminar atributo
  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // Generar variantes a partir de atributos
  const generateVariants = () => {
    if (attributes.length === 0) return;

    // Generar todas las combinaciones
    const combinations = attributes.reduce(
      (acc, attr) => {
        const newCombinations: Record<string, string>[] = [];
        acc.forEach((combination) => {
          attr.values.forEach((value) => {
            newCombinations.push({ ...combination, [attr.name]: value });
          });
        });
        return newCombinations;
      },
      [{}] as Record<string, string>[]
    );

    // Crear variantes
    const newVariants: ProductVariant[] = combinations.map((combo, index) => {
      const variantName = Object.values(combo).join(' - ');
      return {
        id: `temp-${index}`,
        productId: '',
        name: variantName,
        sku: `${parentSku}-${index + 1}`,
        price: null,
        stock: 0,
        isActive: true,
        sortOrder: index,
        options: combo,
      };
    });

    onChange(newVariants);
    toast.success(`Se generaron ${newVariants.length} variantes`);
    setIsDialogOpen(false);
  };

  // Actualizar variante
  const updateVariant = (index: number, field: keyof ProductVariant, value: unknown) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    onChange(newVariants);
  };

  // Eliminar variante
  const removeVariant = (index: number) => {
    onChange(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Header con botón de generar */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Variantes</h3>
          <p className="text-sm text-muted-foreground">
            {variants.length} variantes configuradas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Generar variantes
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generar variantes</DialogTitle>
              <DialogDescription>
                Definí los atributos y sus valores para generar todas las combinaciones.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Atributos existentes */}
              {attributes.length > 0 && (
                <div className="space-y-2">
                  {attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="font-medium">{attr.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {attr.values.join(', ')}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAttribute(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Agregar nuevo atributo */}
              <div className="space-y-2">
                <div className="grid gap-2">
                  <Label htmlFor="attrName">Nombre del atributo</Label>
                  <Input
                    id="attrName"
                    value={newAttributeName}
                    onChange={(e) => setNewAttributeName(e.target.value)}
                    placeholder="Ej: Color, Talle"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="attrValues">Valores (separados por coma)</Label>
                  <Input
                    id="attrValues"
                    value={newAttributeValues}
                    onChange={(e) => setNewAttributeValues(e.target.value)}
                    placeholder="Ej: Rojo, Azul, Verde"
                  />
                </div>
                <Button type="button" onClick={handleAddAttribute}>
                  Agregar atributo
                </Button>
              </div>

              {/* Advertencia */}
              {attributes.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Al generar variantes se reemplazarán las existentes.
                  </p>
                </div>
              )}

              <Button
                onClick={generateVariants}
                disabled={attributes.length === 0}
                className="w-full"
              >
                Generar {attributes.length > 0 && `(${attributes.reduce((acc, attr) => acc * attr.values.length, 1)} combinaciones)`}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de variantes */}
      {variants.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant, index) => (
              <TableRow key={variant.id || index}>
                <TableCell>
                  <p className="font-medium">{variant.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {Object.entries(variant.options)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(', ')}
                  </p>
                </TableCell>
                <TableCell>
                  <Input
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(index, 'sku', e.target.value)
                    }
                    className="w-[150px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={variant.price?.toString() || ''}
                    onChange={(e) =>
                      updateVariant(
                        index,
                        'price',
                        e.target.value ? parseFloat(e.target.value) : null
                      )
                    }
                    placeholder={parentPrice.toString()}
                    className="w-[100px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(index, 'stock', parseInt(e.target.value) || 0)
                    }
                    className="w-[80px]"
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={variant.isActive}
                    onCheckedChange={(checked) =>
                      updateVariant(index, 'isActive', checked)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariant(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default VariantManager;
