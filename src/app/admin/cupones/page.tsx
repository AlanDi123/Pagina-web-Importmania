import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CouponForm } from '@/components/admin/CouponForm';
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
import { formatARS } from '@/lib/formatters';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Cupones',
  description: 'Gestión de cupones',
};

export default async function CuponesAdminPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cupones</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo cupón
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => {
              const isExpired = coupon.endDate && coupon.endDate < now;
              const isScheduled = coupon.startDate && coupon.startDate > now;

              return (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-medium">
                    {coupon.code}
                  </TableCell>
                  <TableCell>{coupon.description || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {coupon.type === 'PERCENTAGE'
                        ? 'Porcentaje'
                        : coupon.type === 'FIXED_AMOUNT'
                        ? 'Monto fijo'
                        : 'Envío gratis'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {coupon.type === 'PERCENTAGE'
                      ? `${coupon.value.toNumber()}%`
                      : coupon.type === 'FREE_SHIPPING'
                      ? '-'
                      : formatARS(coupon.value.toNumber())}
                  </TableCell>
                  <TableCell>
                    {coupon.usageCount}
                    {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                  </TableCell>
                  <TableCell>
                    {coupon.endDate
                      ? format(coupon.endDate, 'dd/MM/yyyy', { locale: es })
                      : 'Sin vencimiento'}
                  </TableCell>
                  <TableCell>
                    {isExpired ? (
                      <Badge variant="secondary">Expirado</Badge>
                    ) : isScheduled ? (
                      <Badge variant="outline">Programado</Badge>
                    ) : coupon.isActive ? (
                      <Badge>Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
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
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
