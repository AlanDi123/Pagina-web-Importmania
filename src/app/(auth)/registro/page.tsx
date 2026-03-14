'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-hot-toast';

export default function RegistroPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    referralCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones');
      return;
    }

    // Validar contraseña
    if (formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          newsletter,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar');
      }

      toast.success('¡Cuenta creada exitosamente!');

      // Auto-login
      const { signIn } = await import('next-auth/react');
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-center">
            Completá los datos para registrarte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isLoading}
                leftIcon={<User className="h-4 w-4" />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isLoading}
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+54 11 1234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isLoading}
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={isLoading}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-text-secondary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
              <p className="text-xs text-text-secondary">
                Mínimo 8 caracteres
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralCode">Código de referido (opcional)</Label>
              <Input
                id="referralCode"
                type="text"
                placeholder="Código"
                value={formData.referralCode}
                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-text-secondary">
                Acepto los{' '}
                <Link href="/terminos" className="text-brand-primary hover:underline">
                  Términos y Condiciones
                </Link>{' '}
                y la{' '}
                <Link href="/privacidad" className="text-brand-primary hover:underline">
                  Política de Privacidad
                </Link>
              </label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="newsletter"
                checked={newsletter}
                onCheckedChange={(checked) => setNewsletter(checked as boolean)}
              />
              <label htmlFor="newsletter" className="text-sm text-text-secondary">
                Quiero recibir novedades y ofertas exclusivas
              </label>
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="brand"
              loading={isLoading}
            >
              Crear Cuenta
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-center text-text-secondary">
            ¿Ya tenés una cuenta?{' '}
            <Link href="/login" className="text-brand-primary hover:underline font-medium">
              Iniciá sesión
            </Link>
          </p>
          <Link
            href="/"
            className="text-sm text-text-secondary hover:text-brand-primary"
          >
            ← Volver al inicio
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
