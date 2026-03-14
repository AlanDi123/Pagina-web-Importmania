'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ButtonProps, buttonVariants } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

const Pagination = ({ currentPage, totalPages, baseUrl }: PaginationProps) => {
  const pages = React.useMemo(() => {
    const result: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        result.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) result.push(i);
        result.push('ellipsis');
        result.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        result.push(1);
        result.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) result.push(i);
      } else {
        result.push(1);
        result.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) result.push(i);
        result.push('ellipsis');
        result.push(totalPages);
      }
    }

    return result;
  }, [currentPage, totalPages]);

  const createPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}page=${page}`;
  };

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className="mx-auto flex w-full justify-center"
    >
      <ul className="flex flex-row items-center gap-1">
        {/* Anterior */}
        <li>
          {currentPage > 1 ? (
            <Link
              href={createPageUrl(currentPage - 1)}
              className={buttonVariants({ variant: 'outline' })}
            >
              <span className="sr-only">Anterior</span>
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Link>
          ) : (
            <Button variant="outline" disabled className="opacity-50">
              <span className="sr-only">Anterior</span>
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Anterior</span>
            </Button>
          )}
        </li>

        {/* Páginas */}
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <li key={`ellipsis-${index}`}>
              <Button variant="ghost" disabled className="w-10 px-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Más páginas</span>
              </Button>
            </li>
          ) : (
            <li key={page}>
              <Link
                href={createPageUrl(page as number)}
                aria-current={page === currentPage ? 'page' : undefined}
                className={buttonVariants({
                  variant: page === currentPage ? 'default' : 'outline',
                })}
              >
                {page}
              </Link>
            </li>
          )
        )}

        {/* Siguiente */}
        <li>
          {currentPage < totalPages ? (
            <Link
              href={createPageUrl(currentPage + 1)}
              className={buttonVariants({ variant: 'outline' })}
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
            </Link>
          ) : (
            <Button variant="outline" disabled className="opacity-50">
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
            </Button>
          )}
        </li>
      </ul>
    </nav>
  );
};

interface ButtonPropsWithRef extends ButtonProps {
  ref?: React.Ref<HTMLButtonElement>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonPropsWithRef>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Pagination, Button };
