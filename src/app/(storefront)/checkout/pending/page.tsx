'use client';

import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Package } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPendingPage() {
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
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <CardTitle className="text-3xl">Pago en proceso</CardTitle>
              <CardDescription>
                Tu pago está siendo procesado
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
                  El pago está siendo verificado por MercadoPago. Esto puede tomar unos minutos.
                </p>
                <p className="text-sm text-muted-foreground">
                  Una vez confirmado, recibirás un email de confirmación.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-yellow-600">
                <Package className="h-5 w-5" />
                <span className="font-medium">Tu pedido está reservado</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link href="/cuenta/pedidos">Ver mis pedidos</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/">Volver al inicio</Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                ¿Tenés dudas? Contactanos por WhatsApp o email.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer categories={[]} socialLinks={{}} contactInfo={{}} />
    </>
  );
}
