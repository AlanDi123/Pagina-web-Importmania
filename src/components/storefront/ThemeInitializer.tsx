'use client';

import { useEffect } from 'react';
import { initializeTheme } from '@/stores/uiStore';

export function ThemeInitializer() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return null;
}
