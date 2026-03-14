'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

interface CookieConsentProps {
  className?: string;
}

export function CookieConsent({ className }: CookieConsentProps) {
  const { cookieConsent, acceptCookies } = useUIStore();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (!cookieConsent.accepted) {
      // Mostrar con delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cookieConsent.accepted]);

  const handleAcceptAll = () => {
    acceptCookies({ analytics: true, marketing: true });
    setIsVisible(false);
  };

  const handleAcceptSelected = () => {
    acceptCookies(preferences);
    setIsVisible(false);
  };

  const handleReject = () => {
    acceptCookies({ analytics: false, marketing: false });
    setIsVisible(false);
  };

  if (!isVisible || cookieConsent.accepted) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg',
        className
      )}
    >
      <div className="container mx-auto max-w-7xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-1">
                  🍪 Uso de cookies
                </h3>
                <p className="text-sm text-text-secondary">
                  Usamos cookies propias y de terceros para mejorar tu experiencia de navegación,
                  analizar el tráfico del sitio y personalizar el contenido. Al aceptar, nos ayudás
                  a ofrecerte un mejor servicio.
                </p>
                {!showPreferences && (
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="text-sm text-brand-primary hover:underline mt-1 inline-block"
                  >
                    Configurar preferencias
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-text-secondary hover:text-text-primary flex-shrink-0"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {showPreferences && (
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Cookies necesarias
                    </p>
                    <p className="text-xs text-text-secondary">
                      Esenciales para el funcionamiento del sitio
                    </p>
                  </div>
                  <span className="text-xs text-text-secondary">Siempre activas</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Cookies de analytics
                    </p>
                    <p className="text-xs text-text-secondary">
                      Nos ayudan a entender cómo usás el sitio
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences({ ...preferences, analytics: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Cookies de marketing
                    </p>
                    <p className="text-xs text-text-secondary">
                      Para mostrarte publicidad relevante
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({ ...preferences, marketing: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-primary rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-primary"></div>
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            {showPreferences && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAcceptSelected}
                className="w-full sm:w-auto"
              >
                Guardar selección
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="w-full sm:w-auto"
            >
              Rechazar
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handleAcceptAll}
              className="w-full sm:w-auto"
            >
              Acceptar todas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
