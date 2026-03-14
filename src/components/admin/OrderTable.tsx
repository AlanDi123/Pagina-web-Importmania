'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderListItem, OrderStatus, PaymentStatus, PaymentMethod, ShippingMethod } from '@/types/order';
import { formatARS } from '@/lib/formatters';
import { formatDateShort } from '@/lib/formatters';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-500',
  PAYMENT_RECEIVED: 'bg-blue-500',
  PROCESSING: 'bg-purple-500',
  SHIPPED: 'bg-cyan-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  REFUNDED: 'bg-gray-500',
  PICKUP_READY: 'bg-green-500',
  PICKED_UP: 'bg-green-600',
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: 'bg-yellow-500',
  APPROVED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  CANCELLED: 'bg-gray-500',
  REFUNDED: 'bg-blue-500',
  IN_REVIEW: 'bg-purple-500',
};

interface OrderTableProps {
  orders: OrderListItem[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: PaymentMethod;
    search?: string;
  };
  onFilterChange: (filters: Partial<OrderTableProps['filters']>) => void;
  onPageChange: (page: number) => void;
}

export function OrderTable({
  orders,
  pagination,
  filters,
  onFilterChange,
  onPageChange,
}: OrderTableProps) {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearch = () => {
    onFilterChange({ search: searchInput });
  };

  const shippingMethodLabels: Record<ShippingMethod, string> = {
    HOME_DELIVERY: 'Envío',
    ANDREANI: 'Andreani',
    OCA: 'OCA',
    CORREO_ARGENTINO: 'Correo',
    PICKUP: 'Retiro',
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar por Nº o cliente..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Select
          value={filters.status || ''}
          onValueChange={(value) =>
            onFilterChange({ status: value as OrderStatus || undefined })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los estados</SelectItem>
            {Object.entries(ORDER_STATUS_COLORS).map(([status]) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentStatus || ''}
          onValueChange={(value) =>
            onFilterChange({ paymentStatus: value as PaymentStatus || undefined })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los pagos</SelectItem>
            {Object.entries(PAYMENT_STATUS_COLORS).map(([status]) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentMethod || ''}
          onValueChange={(value) =>
            onFilterChange({ paymentMethod: value as PaymentMethod || undefined })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Método de pago" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los métodos</SelectItem>
            <SelectItem value="MERCADOPAGO">MercadoPago</SelectItem>
            <SelectItem value="TRANSFER">Transferencia</SelectItem>
            <SelectItem value="CASH">Efectivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nº Pedido</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Pago</TableHead>
            <TableHead>Envío</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{formatDateShort(order.createdAt)}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={ORDER_STATUS_COLORS[order.status]}>
                  {order.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={PAYMENT_STATUS_COLORS[order.paymentStatus]}>
                  {order.paymentStatus.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>{shippingMethodLabels[order.shippingMethod]}</TableCell>
              <TableCell className="text-right font-medium">
                {formatARS(order.total)}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/admin/pedidos/${order.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} -{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}{' '}
            de {pagination.totalItems} pedidos
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTable;
