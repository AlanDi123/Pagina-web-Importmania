'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error('Error en la aplicación:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <CardTitle className="text-2xl">Algo salió mal</CardTitle>
          <CardDescription>
            Ha ocurrido un error inesperado. Por favor, intentá de nuevo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mostrar detalles del error solo en desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-muted rounded-md text-sm font-mono break-words">
              {error.message || 'Error desconocido'}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button onClick={reset} className="flex-1">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Intentar de nuevo
          </Button>
          <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
            <Home className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
