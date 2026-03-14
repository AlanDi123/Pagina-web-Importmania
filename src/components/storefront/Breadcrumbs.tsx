'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  const allItems = showHome
    ? [{ label: 'Inicio', href: '/' }, ...items]
    : items;

  return (
    <nav className={cn('flex items-center text-sm text-text-secondary', className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={item.href || item.label} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1 flex-shrink-0" />
              )}
              {isLast ? (
                <span className="text-text-primary font-medium truncate max-w-[200px] sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || '#'}
                  className="hover:text-brand-primary transition-colors truncate max-w-[150px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
