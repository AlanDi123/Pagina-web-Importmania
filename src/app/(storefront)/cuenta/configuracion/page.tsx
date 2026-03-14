import { Metadata } from 'next';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heart, MapPin, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Configuración',
  description: 'Configurá tu cuenta',
};

export default function ConfiguracionPage() {
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
              { label: 'Configuración' },
            ]}
          />

          <div className="mt-8 space-y-8">
            <h1 className="text-3xl font-bold">Configuración de Cuenta</h1>

            {/* Datos personales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Datos Personales
                </CardTitle>
                <CardDescription>
                  Actualizá tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Tu nombre" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" disabled value="usuario@ejemplo.com" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+54 11 1234-5678" />
                  </div>
                </div>
                <Button>Guardar cambios</Button>
              </CardContent>
            </Card>

            {/* Cambiar contraseña */}
            <Card>
              <CardHeader>
                <CardTitle>Contraseña</CardTitle>
                <CardDescription>
                  Cambiá tu contraseña de acceso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button>Actualizar contraseña</Button>
              </CardContent>
            </Card>

            {/* Direcciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Direcciones
                </CardTitle>
                <CardDescription>
                  Gestioná tus direcciones de envío
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Casa</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Predeterminada
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Av. Corrientes 1234, Piso 5, Dpto A
                      <br />
                      CABA, Buenos Aires, 1043
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="outline" size="sm" className="text-destructive">
                        Eliminar
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    + Agregar nueva dirección
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Preferencias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Preferencias
                </CardTitle>
                <CardDescription>
                  Configurá tus preferencias de comunicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-muted-foreground">
                      Recibí ofertas y novedades por email
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Desuscribirse</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones push</p>
                    <p className="text-sm text-muted-foreground">
                      Recibí notificaciones en tu navegador
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Activar</Button>
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

export default ConfiguracionPage;
