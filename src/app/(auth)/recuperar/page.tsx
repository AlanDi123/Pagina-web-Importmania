'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';

export default function RecuperarPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [formData, setFormData] = useState({ email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar email');
      }

      setEmailSent(true);
      toast.success('Email de recuperación enviado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al enviar email');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              ¡Email enviado!
            </CardTitle>
            <CardDescription className="text-center">
              Revisá tu bandeja de entrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-text-secondary">
              Enviamos un email a <strong>{formData.email}</strong> con las instrucciones para recuperar tu contraseña.
            </p>
            <p className="text-sm text-center text-text-secondary">
              ¿No recibiste el email? Revisá tu carpeta de spam o intentá de nuevo.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setEmailSent(false)}
            >
              Intentar de nuevo
            </Button>
            <Link href="/login" className="text-sm text-center text-brand-primary hover:underline">
              ← Volver al login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Recuperar Contraseña
          </CardTitle>
          <CardDescription className="text-center">
            Ingresá tu email y te enviaremos las instrucciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ email: e.target.value })}
                required
                disabled={isLoading}
                leftIcon={<Mail className="h-4 w-4" />}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              variant="brand"
              loading={isLoading}
            >
              Enviar Email
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link
            href="/login"
            className="text-sm text-center text-text-secondary hover:text-brand-primary"
          >
            ← Volver al login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
