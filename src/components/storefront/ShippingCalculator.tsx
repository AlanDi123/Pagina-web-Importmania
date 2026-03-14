'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShippingQuote } from '@/types/shipping';
import { formatARS } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Truck, MapPin } from 'lucide-react';

interface ShippingCalculatorProps {
  productWeight?: number;
  productAmount: number;
  className?: string;
}

export function ShippingCalculator({
  productWeight = 500,
  productAmount,
  className,
}: ShippingCalculatorProps) {
  const [postalCode, setPostalCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quotes, setQuotes] = useState<ShippingQuote[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (postalCode.length !== 4) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/envios/cotizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postalCode,
          totalWeight: productWeight,
          totalAmount: productAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al calcular envío');
      }

      setQuotes(data.quotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular');
      setQuotes(null);
    } finally {
      setIsLoading(false);
    }
  };

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '541112345678';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola!%20Quiero%20consultar%20por%20un%20envío`;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Input de código postal */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Código postal"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          maxLength={4}
          className="flex-1"
        />
        <Button onClick={handleCalculate} disabled={isLoading || postalCode.length !== 4}>
          Calcular
        </Button>
      </div>

      {/* Resultados */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-destructive text-sm mb-2">{error}</p>
          <Button variant="outline" size="sm" asChild>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              Consultar por WhatsApp
            </a>
          </Button>
        </div>
      )}

      {quotes && quotes.length > 0 && (
        <div className="space-y-2">
          {quotes.map((quote) => (
            <div
              key={quote.method}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg border',
                quote.isFree && 'border-green-500 bg-green-50 dark:bg-green-950/20'
              )}
            >
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{quote.name}</p>
                  <p className="text-xs text-muted-foreground">{quote.estimatedDays}</p>
                </div>
              </div>
              <div className="text-right">
                {quote.isFree ? (
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    GRATIS
                  </Badge>
                ) : (
                  <p className="font-semibold">{formatARS(quote.price)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Retiro en persona */}
      <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Retiro en persona</p>
            <p className="text-xs text-muted-foreground">Av. Corrientes 1234, CABA</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-500 text-white">
          GRATIS
        </Badge>
      </div>
    </div>
  );
}

export default ShippingCalculator;
