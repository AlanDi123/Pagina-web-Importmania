'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || '';

  return (
    <>
      <PromoBar enabled={false} />
      <Header logo="" categories={[]} />

      <main className="py-16 min-h-[60vh]">
        <div className="container mx-auto max-w-2xl px-4">
          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-3xl">¡Pedido confirmado!</CardTitle>
              <CardDescription>
                Tu pedido ha sido creado exitosamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {orderNumber && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Número de pedido</p>
                  <p className="text-2xl font-bold">{orderNumber}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Te enviamos un email de confirmación con todos los detalles.
                </p>
                <p className="text-sm text-muted-foreground">
                  Podés seguir el estado de tu pedido desde tu cuenta.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link href="/cuenta/pedidos">Ver mis pedidos</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/productos">Seguir comprando</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer categories={[]} socialLinks={{}} contactInfo={{}} />
    </>
  );
}
