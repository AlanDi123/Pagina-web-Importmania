import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Verificar autenticación
  if (!session?.user) {
    redirect('/login');
  }

  // Verificar rol de admin
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  // Obtener notificaciones no leídas
  const unreadCount = await prisma.notification.count({
    where: {
      userId: session.user.id,
      isRead: false,
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar se implementará como componente cliente */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-border fixed h-full">
        <div className="p-6">
          <h1 className="text-xl font-bold text-brand-primary">iMPORTMANIA</h1>
          <p className="text-xs text-text-secondary mt-1">Panel de Administración</p>
        </div>
        <nav className="px-4 space-y-1">
          <a
            href="/admin"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            📊 Dashboard
          </a>
          <a
            href="/admin/productos"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            📦 Productos
          </a>
          <a
            href="/admin/categorias"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            📂 Categorías
          </a>
          <a
            href="/admin/pedidos"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            🛒 Pedidos
          </a>
          <a
            href="/admin/clientes"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            👥 Clientes
          </a>
          <a
            href="/admin/cupones"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            🎫 Cupones
          </a>
          <a
            href="/admin/blog"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            📝 Blog
          </a>
          <a
            href="/admin/referidos"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            🎁 Referidos
          </a>
          <a
            href="/admin/envios"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            🚚 Envíos
          </a>
          <a
            href="/admin/notificaciones"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
          >
            🔔 Notificaciones
            {unreadCount > 0 && (
              <span className="absolute right-3 top-2 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </a>
          <a
            href="/admin/marketing"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            📧 Marketing
          </a>
          <a
            href="/admin/configuracion"
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ⚙️ Configuración
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-border px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Panel de Administración</h2>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                className="text-sm text-text-secondary hover:text-brand-primary"
              >
                Ver tienda →
              </a>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold text-sm">
                  {session.user.name?.charAt(0) || session.user.email.charAt(0)}
                </div>
                <span className="text-sm text-text-secondary">{session.user.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
