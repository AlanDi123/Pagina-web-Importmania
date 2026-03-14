'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Header } from '@/components/storefront/Header';
import { Footer } from '@/components/storefront/Footer';
import { PromoBar } from '@/components/storefront/PromoBar';
import { Breadcrumbs } from '@/components/storefront/Breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import { Heart, MapPin, User, Loader2 } from 'lucide-react';

export default function ConfiguracionPage() {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Cargar datos del usuario
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/login?redirect=/cuenta/configuracion');
    }

    if (session?.user) {
      const fetchProfile = async () => {
        try {
          const response = await fetch('/api/users/profile');
          if (response.ok) {
            const data = await response.json();
            setUserData({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
            });
          }
        } catch (error) {
          console.error('Error al cargar perfil:', error);
        }
      };

      fetchProfile();
    }
  }, [session, status]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Error al actualizar');

      await update();
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error('Error al actualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al cambiar contraseña');
      }

      toast.success('Contraseña actualizada');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cambiar contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar cambios'}
                  </Button>
                </form>
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
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">Nueva contraseña</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Direcciones - Placeholder */}
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
                <div className="text-center py-8 text-muted-foreground">
                  <p>Funcionalidad próximamente</p>
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
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificaciones push</p>
                    <p className="text-sm text-muted-foreground">
                      Recibí notificaciones en tu navegador
                    </p>
                  </div>
                  <Switch />
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
