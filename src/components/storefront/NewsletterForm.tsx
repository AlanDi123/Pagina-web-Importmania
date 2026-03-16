'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

interface NewsletterFormProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
  showDescription?: boolean;
}

export function NewsletterForm({
  className,
  placeholder = 'Tu email',
  buttonText = 'Suscribirme',
  showDescription = true,
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Por favor ingresa tu email');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al suscribirse');
      }

      toast.success('¡Gracias por suscribirte!');
      setEmail('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al suscribirse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {showDescription && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            Suscribite al newsletter
          </h3>
          <p className="text-sm text-text-secondary">
            Recibí novedades, ofertas exclusivas y consejos directamente en tu email.
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          disabled={isLoading}
          autoComplete="email"
        />
        <Button
          type="submit"
          variant="brand"
          disabled={isLoading}
          leftIcon={isLoading ? undefined : <Send className="h-4 w-4" />}
          loading={isLoading}
        >
          {buttonText}
        </Button>
      </div>

      <p className="mt-2 text-xs text-text-secondary">
        Al suscribirte, aceptás recibir comunicaciones de iMPORTMANIA. Podés darte de baja en cualquier momento.
      </p>
    </form>
  );
}

export default NewsletterForm;
