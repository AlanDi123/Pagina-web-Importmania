import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Heart, User, Copy } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Gestioná tu cuenta de iMPORTMANIA',
};

export default async function CuentaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login?redirect=/cuenta');
  }

  // Obtener datos reales del usuario (en secuencia)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      referralCode: true,
      _count: {
        select: {
          orders: true,
          wishlist: true,
        },
      },
    },
  });

  const ordersCount = await prisma.order.count({
    where: { userId: session.user.id },
  });

  const wishlistCount = await prisma.wishlistItem.count({
    where: { userId: session.user.id },
  });

  if (!user) {
    redirect('/login');
  }

  // Obtener config
  const storeConfig = await prisma.storeConfig.findMany();
  const config = Object.fromEntries(storeConfig.map((c) => [c.key, c.value]));

  return (
    <>
      <PromoBar
        text={(config.promoBarText as string) || '¡Envío gratis en compras mayores a $50.000!'}
        enabled={(config.promoBarEnabled as boolean) || true}
      />

      <main className="py-8 min-h-[60vh]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Mi Cuenta' },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-8">
              Hola, {user.name || 'Usuario'}
            </h1>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ordersCount}</div>
                  <p className="text-xs text-muted-foreground">Pedidos realizados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{wishlistCount}</div>
                  <p className="text-xs text-muted-foreground">Productos guardados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Código referido</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <code className="text-lg font-bold bg-muted px-2 py-1 rounded">
                      {user.referralCode}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.clipboard.writeText(user.referralCode);
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compartí y ganá recompensas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Perfil</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/cuenta/configuracion">Editar perfil</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Accesos rápidos */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Mis Pedidos
                  </CardTitle>
                  <CardDescription>
                    Seguí el estado de tus compras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/cuenta/pedidos">Ver pedidos</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Favoritos
                  </CardTitle>
                  <CardDescription>
                    Tus productos guardados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/cuenta/favoritos">Ver favoritos</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Configuración
                  </CardTitle>
                  <CardDescription>
                    Gestioná tu perfil y direcciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/cuenta/configuracion">Configurar</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
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
