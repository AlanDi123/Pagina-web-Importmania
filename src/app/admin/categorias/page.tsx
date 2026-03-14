import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
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
import { Edit, Trash2, Plus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Categorías',
  description: 'Gestión de categorías',
};

export default async function CategoriasAdminPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      parent: true,
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nueva categoría
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flatCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div style={{ paddingLeft: `${category.level * 24}px` }}>
                    {category.level > 0 && <span className="text-muted-foreground mr-2">└─</span>}
                    {category.name}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                <TableCell>{category._count.products}</TableCell>
                <TableCell>{category.sortOrder}</TableCell>
                <TableCell>
                  <Badge variant={category.isActive ? 'default' : 'secondary'}>
                    {category.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
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
