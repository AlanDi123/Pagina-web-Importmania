import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatARS } from '@/lib/formatters';
import { formatDateShort } from '@/lib/formatters';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mis Pedidos',
  description: 'Seguimiento de tus pedidos',
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500',
  PAYMENT_RECEIVED: 'bg-blue-500',
  PROCESSING: 'bg-purple-500',
  SHIPPED: 'bg-cyan-500',
  DELIVERED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  PICKUP_READY: 'bg-green-500',
};

export default async function PedidosPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?redirect=/cuenta/pedidos');
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  // Obtener config
  const storeConfig = await prisma.storeConfig.findMany();
  const config = Object.fromEntries(storeConfig.map((c) => [c.key, c.value]));

  return (
    <>
      <PromoBar
        text={(config.promoBarText as string) || '¡Envío gratis en compras mayores a $50.000!'}
        enabled={(config.promoBarEnabled as boolean) || true}
      />

      <Header
        logo={config.logo as string}
        categories={[]}
      />

      <main className="py-8 min-h-[60vh]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Mi Cuenta', href: '/cuenta' },
              { label: 'Mis Pedidos' },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

            {orders.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-4">
                  No tenés pedidos realizados.
                </p>
                <Button asChild>
                  <Link href="/productos">Explorar productos</Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Pedido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{formatDateShort(order.createdAt)}</TableCell>
                      <TableCell>
                        <Badge className={ORDER_STATUS_COLORS[order.status] || 'bg-gray-500'}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatARS(order.total.toNumber())}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/cuenta/pedidos/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </main>

      <Footer
        categories={[]}
        socialLinks={{
          instagram: config.instagramUrl as string,
          facebook: config.facebookUrl as string,
          tiktok: config.tiktokUrl as string,
        }}
        contactInfo={{
          email: config.contactEmail as string,
          phone: config.contactPhone as string,
          address: config.storeAddress as string,
        }}
      />
    </>
  );
}
