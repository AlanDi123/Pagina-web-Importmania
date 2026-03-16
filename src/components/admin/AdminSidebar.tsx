'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  unreadCount: number;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/productos', label: 'Productos', icon: '📦' },
  { href: '/admin/categorias', label: 'Categorías', icon: '📂' },
  { href: '/admin/pedidos', label: 'Pedidos', icon: '🛒' },
  { href: '/admin/clientes', label: 'Clientes', icon: '👥' },
  { href: '/admin/cupones', label: 'Cupones', icon: '🎫' },
  { href: '/admin/blog', label: 'Blog', icon: '📝' },
  { href: '/admin/referidos', label: 'Referidos', icon: '🎁' },
  { href: '/admin/envios', label: 'Envíos', icon: '🚚' },
  { href: '/admin/notificaciones', label: 'Notificaciones', icon: '🔔' },
  { href: '/admin/marketing', label: 'Marketing', icon: '📧' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙️' },
];

export function AdminSidebar({ unreadCount }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-border fixed h-full overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-brand-primary">iMPORTMANIA</h1>
        <p className="text-xs text-text-secondary mt-1">Panel de Administración</p>
      </div>
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center px-4 py-2 text-sm rounded-md transition-colors',
                isActive
                  ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
              {item.href === '/admin/notificaciones' && unreadCount > 0 && (
                <span className="ml-auto h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;
