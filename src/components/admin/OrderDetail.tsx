'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrderWithRelations, OrderStatus, OrderStatusChange } from '@/types/order';
import { formatARS } from '@/lib/formatters';
import { formatDateShort } from '@/lib/formatters';
import { toast } from 'react-hot-toast';
import { Check, Clock, Package, Truck, Home, X } from 'lucide-react';

const ORDER_STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  PENDING: <Clock className="h-4 w-4" />,
  PAYMENT_RECEIVED: <Check className="h-4 w-4" />,
  PROCESSING: <Package className="h-4 w-4" />,
  SHIPPED: <Truck className="h-4 w-4" />,
  DELIVERED: <Home className="h-4 w-4" />,
  CANCELLED: <X className="h-4 w-4" />,
  REFUNDED: <X className="h-4 w-4" />,
  PICKUP_READY: <Package className="h-4 w-4" />,
  PICKED_UP: <Home className="h-4 w-4" />,
};

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

const VALID_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PAYMENT_RECEIVED', 'CANCELLED'],
  PAYMENT_RECEIVED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'PICKUP_READY', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
  PICKUP_READY: ['PICKED_UP', 'CANCELLED'],
  PICKED_UP: [],
};

interface OrderDetailProps {
  order: OrderWithRelations;
}

export function OrderDetail({ order }: OrderDetailProps) {
  const [newStatus, setNewStatus] = useState<OrderStatus>(order.status);
  const [statusComment, setStatusComment] = useState('');
  const [trackingCode, setTrackingCode] = useState(order.trackingCode || '');
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl || '');
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || '');

  const validTransitions = VALID_STATUS_TRANSITIONS[order.status];

  const handleUpdateStatus = async () => {
    try {
      const response = await fetch(`/api/pedidos?id=${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          comment: statusComment,
          trackingCode,
          trackingUrl,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar');

      toast.success('Estado actualizado');
      setStatusComment('');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar');
    }
  };

  const handleSaveNotes = async () => {
    try {
      const response = await fetch(`/api/pedidos?id=${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast.success('Notas guardadas');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  const shippingMethodLabels: Record<string, string> = {
    HOME_DELIVERY: 'Envío a domicilio',
    ANDREANI: 'Andreani',
    OCA: 'OCA',
    CORREO_ARGENTINO: 'Correo Argentino',
    PICKUP: 'Retiro en persona',
  };

  const paymentMethodLabels: Record<string, string> = {
    MERCADOPAGO: 'MercadoPago',
    TRANSFER: 'Transferencia bancaria',
    CASH: 'Efectivo',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pedido #{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            {formatDateShort(order.createdAt)} - {order.user.name || order.user.email}
          </p>
        </div>
        <Badge className={ORDER_STATUS_COLORS[order.status]}>
          {ORDER_STATUS_ICONS[order.status]}
          <span className="ml-2">{order.status.replace('_', ' ')}</span>
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Información del cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Nombre:</strong> {order.user.name || 'Sin nombre'}
            </p>
            <p>
              <strong>Email:</strong> {order.user.email}
            </p>
            {order.user.phone && (
              <p>
                <strong>Teléfono:</strong> {order.user.phone}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Dirección de envío */}
        {order.address && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dirección de envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>{order.address.street} {order.address.number}</p>
              {order.address.floor && <p>Piso {order.address.floor}</p>}
              {order.address.apartment && <p>Depto {order.address.apartment}</p>}
              <p>{order.address.city}, {order.address.province}</p>
              <p>{order.address.postalCode}</p>
              {order.address.phone && <p>Tel: {order.address.phone}</p>}
            </CardContent>
          </Card>
        )}

        {/* Items del pedido */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                    {item.product.images?.[0]?.url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.product.images[0].url}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-sm text-muted-foreground">{item.variantName}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x {formatARS(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatARS(item.subtotal)}</p>
                </div>
              ))}
            </div>

            {/* Resumen financiero */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatARS(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento:</span>
                  <span>-{formatARS(order.discount)}</span>
                </div>
              )}
              {order.shippingCost > 0 && (
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>{formatARS(order.shippingCost)}</span>
                </div>
              )}
              {order.transferDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desc. transferencia:</span>
                  <span>-{formatARS(order.transferDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span className="text-brand-primary">{formatARS(order.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pago */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pago</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Método:</strong> {paymentMethodLabels[order.paymentMethod]}
            </p>
            <p>
              <strong>Estado:</strong>{' '}
              <Badge>{order.paymentStatus.replace('_', ' ')}</Badge>
            </p>
            {order.mpPaymentId && (
              <p>
                <strong>MP Payment ID:</strong> {order.mpPaymentId}
              </p>
            )}
            {order.transferReceipt && (
              <div>
                <strong>Comprobante:</strong>
                <a
                  href={order.transferReceipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline block"
                >
                  Ver comprobante
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Envío */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Envío</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Método:</strong> {shippingMethodLabels[order.shippingMethod]}
            </p>
            {order.trackingCode && (
              <p>
                <strong>Código de seguimiento:</strong> {order.trackingCode}
              </p>
            )}
            {order.trackingUrl && (
              <p>
                <strong>URL de seguimiento:</strong>{' '}
                <a
                  href={order.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline"
                >
                  Ver tracking
                </a>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Historial de estados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.history
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((change, index) => (
                  <div key={change.id} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${ORDER_STATUS_COLORS[change.status as OrderStatus]}`}
                    >
                      {ORDER_STATUS_ICONS[change.status as OrderStatus]}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {change.status.replace('_', ' ')}
                      </p>
                      {change.comment && (
                        <p className="text-sm text-muted-foreground">{change.comment}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDateShort(change.createdAt)}{' '}
                        {change.createdBy && `por ${change.createdBy}`}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Actualizar estado */}
        {validTransitions.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Actualizar estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="newStatus">Nuevo estado</Label>
                  <Select
                    value={newStatus}
                    onValueChange={(value) => setNewStatus(value as OrderStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {validTransitions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trackingCode">Código de seguimiento</Label>
                  <Input
                    id="trackingCode"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statusComment">Comentario</Label>
                <Textarea
                  id="statusComment"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  rows={2}
                />
              </div>
              <Button onClick={handleUpdateStatus}>
                Actualizar estado
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Notas admin */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Notas internas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Notas internas (no visibles para el cliente)"
              rows={3}
            />
            <Button onClick={handleSaveNotes} variant="outline">
              Guardar notas
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default OrderDetail;
