'use client';

import { useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Coupon, CouponType } from '@prisma/client';

interface CuponesClientProps {
  initialCoupons: Coupon[];
}

export default function CuponesClient({ initialCoupons }: CuponesClientProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [coupons, setCoupons] = useState(initialCoupons);

  const now = new Date();

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cupón?')) return;

    try {
      const response = await fetch(`/api/admin/cupones?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar');

      toast.success('Cupón eliminado');
      setCoupons(coupons.filter((coupon) => coupon.id !== id));
    } catch (error) {
      toast.error('Error al eliminar cupón');
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (editingCoupon) {
        // Actualizar cupón existente
        const response = await fetch(`/api/admin/cupones?id=${editingCoupon.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al actualizar');

        const updated = await response.json();

        setCoupons(coupons.map((coupon) =>
          coupon.id === editingCoupon.id ? { ...coupon, ...updated } : coupon
        ));

        toast.success('Cupón actualizado');
      } else {
        // Crear nuevo cupón
        const response = await fetch('/api/admin/cupones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al crear');

        const created = await response.json();

        setCoupons([...coupons, created]);

        toast.success('Cupón creado');
      }

      setIsFormOpen(false);
      setEditingCoupon(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar cupón');
    }
  };

  const getTypeBadgeVariant = (type: CouponType) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'default';
      case 'FIXED_AMOUNT':
        return 'secondary';
      case 'FREE_SHIPPING':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: CouponType) => {
    switch (type) {
      case 'PERCENTAGE':
        return 'Porcentaje';
      case 'FIXED_AMOUNT':
        return 'Monto fijo';
      case 'FREE_SHIPPING':
        return 'Envío gratis';
      default:
        return type;
    }
  };

  const getStatusBadge = (coupon: Coupon) => {
    const isExpired = coupon.endDate && coupon.endDate < now;
    const isScheduled = coupon.startDate && coupon.startDate > now;

    if (isExpired) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    if (isScheduled) {
      return <Badge variant="outline">Programado</Badge>;
    }
    if (coupon.isActive) {
      return <Badge className="bg-green-500">Activo</Badge>;
    }
    return <Badge variant="secondary">Inactivo</Badge>;
  };

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === 'PERCENTAGE') {
      return `${coupon.value.toNumber()}%`;
    }
    if (coupon.type === 'FREE_SHIPPING') {
      return '-';
    }
    return `$${coupon.value.toNumber().toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cupones</h1>
        <Dialog open={isFormOpen && !editingCoupon} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo cupón
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo cupón</DialogTitle>
            </DialogHeader>
            <CouponForm
              open={isFormOpen && !editingCoupon}
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
              <TableHead>Código</TableHead>
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
                  <TableCell>
                    <Badge variant={getTypeBadgeVariant(coupon.type)}>
                      {getTypeLabel(coupon.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatValue(coupon)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {coupon.usageCount}
                      {coupon.usageLimit && (
                        <span className="text-muted-foreground">
                          {' '}
                          / {coupon.usageLimit}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {coupon.endDate ? (
                      <div className="text-sm">
                        {format(coupon.endDate, 'dd/MM/yyyy', { locale: es })}
                        {isExpired && (
                          <span className="text-destructive text-xs ml-2">(Expirado)</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sin vencimiento</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(coupon)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={isFormOpen && editingCoupon?.id === coupon.id}
                        onOpenChange={(open) => {
                          if (!open) setEditingCoupon(null);
                          setIsFormOpen(open);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingCoupon(coupon)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Editar cupón</DialogTitle>
                          </DialogHeader>
                          <CouponForm
                            coupon={coupon}
                            open={isFormOpen && editingCoupon?.id === coupon.id}
                            onOpenChange={(open) => {
                              if (!open) setEditingCoupon(null);
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
                        onClick={() => handleDelete(coupon.id)}
                      >
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
