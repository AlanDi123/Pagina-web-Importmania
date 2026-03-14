'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppliedCoupon } from '@/types/coupon';
import { formatARS } from '@/lib/formatters';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface CouponInputProps {
  cartTotal: number;
  onCouponApply: (coupon: AppliedCoupon) => void;
  onCouponRemove: () => void;
  appliedCoupon?: AppliedCoupon | null;
}

export function CouponInput({
  cartTotal,
  onCouponApply,
  onCouponRemove,
  appliedCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/cupones/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.toUpperCase().trim(),
          cartTotal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Cupón inválido');
      }

      onCouponApply(data.coupon);
      setCode('');
      toast.success(`Cupón "${data.coupon.code}" aplicado`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cupón inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <div>
            <p className="font-medium text-sm text-green-800 dark:text-green-200">
              {appliedCoupon.code}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {appliedCoupon.type === 'PERCENTAGE'
                ? `${appliedCoupon.value}% de descuento`
                : appliedCoupon.type === 'FREE_SHIPPING'
                ? 'Envío gratis'
                : `${formatARS(appliedCoupon.value)} de descuento`}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-600 hover:text-green-700"
          onClick={onCouponRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        type="text"
        placeholder="Código de cupón"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        className="flex-1 uppercase"
      />
      <Button
        onClick={handleApply}
        disabled={isLoading || !code.trim()}
        size="sm"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          'Aplicar'
        )}
      </Button>
    </div>
  );
}

export default CouponInput;
