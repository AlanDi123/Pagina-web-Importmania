import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatARS } from '@/lib/formatters';
import { formatDateShort } from '@/lib/formatters';
import { Eye, Search } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Clientes',
  description: 'Gestión de clientes',
};

export default async function ClientesAdminPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const where: any = { role: 'CUSTOMER' };

  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: 'insensitive' } },
      { email: { contains: searchParams.q, mode: 'insensitive' } },
    ];
  }

  const customers = await prisma.user.findMany({
    where,
    include: {
      orders: {
        select: { id: true, total: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const transformedCustomers = customers.map((customer) => ({
    id: customer.id,
    email: customer.email,
    name: customer.name,
    phone: customer.phone,
    role: customer.role,
    isActive: customer.isActive,
    referralCode: customer.referralCode,
    totalOrders: customer.orders.length,
    totalSpent: customer.orders.reduce(
      (sum, order) => sum + order.total.toNumber(),
      0
    ),
    createdAt: customer.createdAt,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Clientes</h1>

      {/* Búsqueda */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          defaultValue={searchParams.q}
          className="pl-10"
        />
      </div>

      {/* Tabla */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total Gastado</TableHead>
              <TableHead>Fecha Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformedCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.name || 'Sin nombre'}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone || '-'}</TableCell>
                <TableCell>{customer.totalOrders}</TableCell>
                <TableCell>{formatARS(customer.totalSpent)}</TableCell>
                <TableCell>{formatDateShort(customer.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/clientes/${customer.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
