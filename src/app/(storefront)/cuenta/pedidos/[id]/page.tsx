import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatARS } from '@/lib/formatters';
import { formatDateShort } from '@/lib/formatters';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Truck, CreditCard, Download } from 'lucide-react';

interface PedidoDetallePageProps {
  params: { id: string };
}

export const metadata: Metadata = {
  title: 'Detalle de Pedido',
  description: 'Seguimiento de tu pedido',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  PAYMENT_RECEIVED: 'bg-blue-500',
  PROCESSING: 'bg-purple-500',
  SHIPPED: 'bg-cyan-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  PICKUP_READY: 'bg-green-500',
  PICKED_UP: 'bg-green-600',
};

export default async function PedidoDetallePage({ params }: PedidoDetallePageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      address: true,
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              images: { where: { isMain: true }, take: 1 },
            },
          },
        },
      },
      history: { orderBy: { createdAt: 'asc' } },
    },
  });

  if (!order) {
    notFound();
  }

  // Verificar ownership
  if (order.userId !== session.user.id) {
    redirect('/cuenta/pedidos');
  }

  const paymentMethodLabels: Record<string, string> = {
    MERCADOPAGO: 'MercadoPago',
    TRANSFER: 'Transferencia bancaria',
    CASH: 'Efectivo',
  };

  return (
    <>
      <PromoBar enabled={false} />
      <Header logo="" categories={[]} />

      <main className="py-8 min-h-[60vh]">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Mi Cuenta', href: '/cuenta' },
              { label: 'Pedidos', href: '/cuenta/pedidos' },
              { label: order.orderNumber },
            ]}
          />

          <div className="mt-8 space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Pedido #{order.orderNumber}</CardTitle>
                    <p className="text-muted-foreground">
                      Realizado el {formatDateShort(order.createdAt)}
                    </p>
                  </div>
                  <Badge className={ORDER_STATUS_COLORS[order.status] || 'bg-gray-500'}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Seguimiento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.history.map((change, index) => (
                    <div key={change.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === order.history.length - 1
                              ? 'bg-brand-primary'
                              : 'bg-muted-foreground'
                          }`}
                        />
                        {index < order.history.length - 1 && (
                          <div className="w-0.5 h-8 bg-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{change.status.replace('_', ' ')}</p>
                        {change.comment && (
                          <p className="text-sm text-muted-foreground">{change.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDateShort(change.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted">
                      {item.product.images[0]?.url && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/productos/${item.product.slug}`}
                        className="font-medium hover:underline"
                      >
                        {item.productName}
                      </Link>
                      {item.variantName && (
                        <p className="text-sm text-muted-foreground">{item.variantName}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatARS(item.price.toNumber())}
                      </p>
                    </div>
                    <p className="font-semibold">{formatARS(item.subtotal.toNumber())}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Envío y Pago */}
            <div className="grid md:grid-cols-2 gap-6">
              {order.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Dirección de envío
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{order.address.street} {order.address.number}</p>
                    {order.address.floor && <p>Piso {order.address.floor}</p>}
                    {order.address.apartment && <p>Depto {order.address.apartment}</p>}
                    <p>{order.address.city}, {order.address.province}</p>
                    <p>{order.address.postalCode}</p>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Método:</strong> {paymentMethodLabels[order.paymentMethod]}
                  </p>
                  <p>
                    <strong>Estado:</strong>{' '}
                    <Badge>{order.paymentStatus.replace('_', ' ')}</Badge>
                  </p>
                  {order.trackingCode && (
                    <p>
                      <strong>Seguimiento:</strong> {order.trackingCode}
                    </p>
                  )}
                  {order.trackingUrl && (
                    <p>
                      <Link
                        href={order.trackingUrl}
                        target="_blank"
                        className="text-brand-primary hover:underline"
                      >
                        Ver seguimiento →
                      </Link>
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resumen financiero */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-w-md ml-auto">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatARS(order.subtotal.toNumber())}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento</span>
                      <span>-{formatARS(order.discount.toNumber())}</span>
                    </div>
                  )}
                  {order.shippingCost > 0 && (
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span>{formatARS(order.shippingCost.toNumber())}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-primary">{formatARS(order.total.toNumber())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/cuenta/pedidos">← Volver a pedidos</Link>
              </Button>
              {order.paymentMethod === 'TRANSFER' && order.paymentStatus === 'PENDING' && (
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Subir comprobante
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer categories={[]} socialLinks={{}} contactInfo={{}} />
    </>
  );
}
