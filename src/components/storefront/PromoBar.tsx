'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

interface PromoBarProps {
  text?: string;
  enabled?: boolean;
}

export function PromoBar({ text, enabled = true }: PromoBarProps) {
  const { isPromoBarDismissed, dismissPromoBar } = useUIStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if dismissed in localStorage
    const dismissed = localStorage.getItem('importmania_promo_bar_dismissed');
    if (!dismissed && enabled && text) {
      setIsVisible(true);
    }
  }, [enabled, text]);

  if (!isVisible || !text || isPromoBarDismissed) {
    return null;
  }

  return (
    <div className="relative bg-brand-accent text-white text-center text-sm py-2 px-4">
      <div className="container mx-auto max-w-7xl">
        <p className="font-medium">{text}</p>
      </div>
      <button
        onClick={() => {
          dismissPromoBar();
          setIsVisible(false);
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Cerrar promoción"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default PromoBar;
