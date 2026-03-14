'use client';

import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutFailurePage() {
  return (
    <>
      <PromoBar enabled={false} />
      <Header logo="" categories={[]} />

      <main className="py-16 min-h-[60vh]">
        <div className="container mx-auto max-w-2xl px-4">
          <Card className="text-center">
            <CardHeader>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-3xl">Error en el pago</CardTitle>
              <CardDescription>
                No pudimos procesar tu pago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Hubo un problema al procesar tu pago. Esto puede deberse a:
                </p>
                <ul className="text-sm text-muted-foreground text-left inline-block space-y-1">
                  <li>• Fondos insuficientes</li>
                  <li>• Datos de tarjeta incorrectos</li>
                  <li>• Problemas temporales con el banco</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="flex-1">
                  <Link href="/checkout">Intentar nuevamente</Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/productos">Volver a la tienda</Link>
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Si el problema persiste, contactanos por WhatsApp o email.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer categories={[]} socialLinks={{}} contactInfo={{}} />
    </>
  );
}
