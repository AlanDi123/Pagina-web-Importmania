'use client';

import Link from 'next/link';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { WhatsAppButton } from '@/components/storefront/WhatsAppButton';
import { NewsletterForm } from '@/components/storefront/NewsletterForm';

interface FooterProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export function Footer({
  categories = [],
  socialLinks = {},
  contactInfo = {},
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Información de la tienda */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-brand-primary">iMPORTMANIA</h3>
            <p className="text-sm text-text-secondary">
              Tu tienda online de productos importados en Argentina. Envíos a todo el país con las mejores marcas y precios.
            </p>
            <div className="flex gap-3">
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-brand-primary transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-brand-primary transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-brand-primary transition-colors"
                  aria-label="TikTok"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Columna 2: Categorías */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Categorías</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/categorias/${category.slug}`}
                    className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/productos"
                  className="text-sm text-brand-primary hover:underline transition-colors"
                >
                  Ver todas →
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Links útiles */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Ayuda</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/cuenta/pedidos"
                  className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
                >
                  Mis pedidos
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidad"
                  className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
                >
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/devoluciones"
                  className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-text-secondary hover:text-brand-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto y Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-text-primary">Contacto</h4>
            {contactInfo.email && (
              <p className="text-sm text-text-secondary">
                ✉️ {contactInfo.email}
              </p>
            )}
            {contactInfo.phone && (
              <p className="text-sm text-text-secondary">
                📱 {contactInfo.phone}
              </p>
            )}
            {contactInfo.address && (
              <p className="text-sm text-text-secondary">
                📍 {contactInfo.address}
              </p>
            )}

            <div className="pt-4 border-t border-border">
              <NewsletterForm showDescription={false} />
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-secondary">
              © {currentYear} iMPORTMANIA. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                💳 Pagá con MercadoPago, transferencia o efectivo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp floating button */}
      <WhatsAppButton variant="floating" />
    </footer>
  );
}

export default Footer;
