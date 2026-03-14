'use client';

import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShareButtons } from '@/components/storefront/ShareButtons';
import { Copy, Gift, Users, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Programa de Referidos',
  description: 'Invitá a tus amigos y ganá recompensas',
};

export default function ReferidosPage() {
  const referralCode = 'BIENVENIDO';
  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/registro?ref=${referralCode}`
    : '';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Código copiado');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast.success('Link copiado');
  };

  return (
    <>
      <PromoBar
        text="¡Envío gratis en compras mayores a $50.000!"
        enabled
      />

      <Header logo="" categories={[]} />

      <main className="py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Programa de Referidos' },
            ]}
          />

          <div className="mt-8 space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Invitá a tus amigos y ganá recompensas
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Por cada amigo que se registre y compre, ambos reciben beneficios exclusivos.
              </p>
            </div>

            {/* Cómo funciona */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 text-brand-primary mx-auto mb-4" />
                  <CardTitle>1. Compartí tu código</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Compartí tu código único con tus amigos y familiares.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Gift className="h-12 w-12 text-brand-primary mx-auto mb-4" />
                  <CardTitle>2. Ellos reciben descuento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Tus amigos obtienen 10% de descuento en su primera compra.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <Percent className="h-12 w-12 text-brand-primary mx-auto mb-4" />
                  <CardTitle>3. Vos ganás recompensas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground">
                    Cuando tu amigo compra, recibís $2000 en tu cuenta.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tu código */}
            <Card className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10">
              <CardHeader>
                <CardTitle>Tu código de referido</CardTitle>
                <CardDescription>
                  Compartilo con tus amigos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Código</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={referralCode}
                        readOnly
                        className="font-mono text-lg"
                      />
                      <Button onClick={handleCopyCode} variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="text-sm text-muted-foreground">Link de referido</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={referralUrl}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button onClick={handleCopyLink} variant="outline">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="text-sm font-medium mb-2">Compartir en:</p>
                  <ShareButtons
                    title="¡Unite a iMPORTMANIA y obtené 10% de descuento!"
                    url={referralUrl}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Beneficios */}
            <Card>
              <CardHeader>
                <CardTitle>Beneficios del programa</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5">Para tu amigo</Badge>
                    <span>10% de descuento en su primera compra</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5">Para vos</Badge>
                    <span>$2000 de recompensa por cada compra de tu referido</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5">Sin límites</Badge>
                    <span>Podés referir a todos los amigos que quieras</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Badge variant="secondary" className="mt-0.5">Fácil de usar</Badge>
                    <span>Compartí tu código por WhatsApp, redes sociales o email</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Preguntas frecuentes */}
            <Card>
              <CardHeader>
                <CardTitle>Preguntas frecuentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">¿Cuándo recibo la recompensa?</p>
                  <p className="text-sm text-muted-foreground">
                    La recompensa se acredita cuando tu referido completa su primera compra.
                  </p>
                </div>
                <div>
                  <p className="font-medium">¿Hay un límite de referidos?</p>
                  <p className="text-sm text-muted-foreground">
                    No, podés referir a todos los amigos que quieras.
                  </p>
                </div>
                <div>
                  <p className="font-medium">¿Puedo usar mi propio código?</p>
                  <p className="text-sm text-muted-foreground">
                    No, no podés usar tu propio código de referido para obtener descuentos.
                  </p>
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
