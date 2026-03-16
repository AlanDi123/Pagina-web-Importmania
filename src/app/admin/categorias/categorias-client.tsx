'use client';

import { useState } from 'react';
import { CategoryForm } from '@/components/admin/CategoryForm';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { Category } from '@prisma/client';

interface CategoriasClientProps {
  initialCategories: (Category & { _count: { products: number }; parent: Category | null })[];
}

export default function CategoriasClient({ initialCategories }: CategoriasClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState(initialCategories);

  // Construir árbol jerárquico
  const buildTree = (parentId: string | null = null, level = 0) => {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => ({
        ...cat,
        level,
        children: buildTree(cat.id, level + 1),
      }));
  };

  const tree = buildTree();

  const flattenTree = (nodes: typeof tree, result: typeof tree = []) => {
    nodes.forEach((node) => {
      result.push(node);
      flattenTree(node.children, result);
    });
    return result;
  };

  const flatCategories = flattenTree(tree);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      const response = await fetch(`/api/categorias/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      toast.success('Categoría eliminada');
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error) {
      toast.error('Error al eliminar categoría');
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingCategory) {
        // Actualizar categoría existente
        const response = await fetch(`/api/categorias/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al actualizar');

        const updated = await response.json();
        
        setCategories(categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...updated } : cat
        ));

        toast.success('Categoría actualizada');
      } else {
        // Crear nueva categoría
        const response = await fetch('/api/categorias', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al crear');

        const created = await response.json();
        
        setCategories([...categories, {
          ...created,
          _count: { products: 0 },
          parent: null,
        }]);

        toast.success('Categoría creada');
      }
      
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar categoría');
    }
  };

  const parentCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <Dialog open={isFormOpen && !editingCategory} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nueva categoría</DialogTitle>
            </DialogHeader>
            <CategoryForm
              categories={parentCategories}
              open={isFormOpen && !editingCategory}
              onOpenChange={setIsFormOpen}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Categoría padre</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flatCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div style={{ paddingLeft: `${category.level * 24}px` }}>
                    {category.level > 0 && (
                      <span className="text-muted-foreground mr-2">└─</span>
                    )}
                    {category.name}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                <TableCell>
                  {category.parent ? (
                    <Badge variant="outline">{category.parent.name}</Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{category._count.products}</TableCell>
                <TableCell>
                  <Badge variant={category.isActive ? 'default' : 'secondary'}>
                    {category.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={isFormOpen && editingCategory?.id === category.id}
                      onOpenChange={(open) => {
                        if (!open) setEditingCategory(null);
                        setIsFormOpen(open);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar categoría</DialogTitle>
                        </DialogHeader>
                        <CategoryForm
                          category={category}
                          categories={parentCategories.filter(
                            (c) => c.id !== category.id
                          )}
                          open={isFormOpen && editingCategory?.id === category.id}
                          onOpenChange={(open) => {
                            if (!open) setEditingCategory(null);
                            setIsFormOpen(open);
                          }}
                          onSave={handleSave}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(category.id)}
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
    </div>
  );
}
