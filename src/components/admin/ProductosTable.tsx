'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatARS } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: { toNumber: () => number };
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  images: Array<{ url: string }>;
  categories: Array<{ category: { name: string } }>;
}

interface ProductosTableProps {
  products: Product[];
}

export function ProductosTable({ products: initialProducts }: ProductosTableProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/productos/${productToDelete}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar producto');
      }

      toast.success('Producto eliminado');
      setProducts(products.filter((p) => p.id !== productToDelete));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar producto');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted">
                    {product.images[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Sin img</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                <TableCell>{formatARS(product.price.toNumber())}</TableCell>
                <TableCell>
                  {product.stock <= 0 ? (
                    <Badge variant="destructive">Sin stock</Badge>
                  ) : product.stock <= product.lowStockThreshold ? (
                    <Badge variant="outline">Bajo ({product.stock})</Badge>
                  ) : (
                    product.stock
                  )}
                </TableCell>
                <TableCell>
                  {product.categories[0]?.category.name || '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/productos/${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ProductosTable;
