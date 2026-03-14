import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatARS } from '@/lib/formatters';
import { Package, Heart, User, Copy } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Gestioná tu cuenta de iMPORTMANIA',
};

export default async function CuentaPage() {
  // En producción, obtener usuario de la sesión
  // Por ahora mostramos página pública con login CTA

  const stats = {
    orders: 0,
    wishlist: 0,
    referralCode: 'BIENVENIDO',
  };

  return (
    <>
      <PromoBar
        text="¡Envío gratis en compras mayores a $50.000!"
        enabled
      />

      <Header logo="" categories={[]} />

      <main className="py-8 min-h-[60vh]">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Mi Cuenta' },
            ]}
          />

          <div className="mt-8">
            <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.orders}</div>
                  <p className="text-xs text-muted-foreground">Pedidos realizados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favoritos</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.wishlist}</div>
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
                      {stats.referralCode}
                    </code>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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

            {/* Programa de referidos */}
            <Card className="mt-8 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
              <CardHeader>
                <CardTitle>Programa de Referidos</CardTitle>
                <CardDescription>
                  Invitá a tus amigos y ganá recompensas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium mb-2">
                      Tu código: <code className="bg-background px-2 py-1 rounded ml-2">{stats.referralCode}</code>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tus amigos obtienen 10% de descuento y vos ganás $2000 cuando compran.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/referidos">Más información</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer categories={[]} socialLinks={{}} contactInfo={{}} />
    </>
  );
}

export default CuentaPage;
