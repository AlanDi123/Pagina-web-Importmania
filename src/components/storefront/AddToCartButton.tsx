'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  quantity?: number;
  disabled?: boolean;
  stock: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  disabled = false,
  stock,
  className,
  size = 'md',
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [buttonState, setButtonState] = useState<'default' | 'loading' | 'success'>('default');

  const isOutOfStock = stock <= 0;
  const isDisabled = disabled || isOutOfStock;

  const handleClick = async () => {
    if (isDisabled) return;

    setButtonState('loading');

    try {
      await addItem({
        productId,
        variantId,
        quantity,
        name: '', // Se completa desde el componente padre
        slug: '',
        sku: '',
        price: 0,
        stock,
      });

      setButtonState('success');

      // Volver al estado default después de 2 segundos
      setTimeout(() => {
        setButtonState('default');
      }, 2000);
    } catch (error) {
      setButtonState('default');
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  if (isOutOfStock) {
    return (
      <Button
        disabled
        className={cn('w-full', sizeClasses[size], className)}
        variant="secondary"
      >
        Sin stock
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      disabled={buttonState === 'loading' || disabled}
      className={cn(
        'w-full transition-all',
        sizeClasses[size],
        buttonState === 'success' && 'bg-green-600 hover:bg-green-700',
        className
      )}
    >
      {buttonState === 'loading' && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {buttonState === 'success' && (
        <>
          <Check className="mr-2 h-4 w-4" />
          ¡Agregado!
        </>
      )}
      {buttonState === 'default' && (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al carrito
        </>
      )}
    </Button>
  );
}

export default AddToCartButton;
