import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';

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
      {/* Sidebar */}
      <AdminSidebar unreadCount={unreadCount} />

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
                  {session.user.name?.charAt(0) ?? session.user.email?.charAt(0) ?? 'A'}
                </div>
                <span className="text-sm text-text-secondary">{session.user.email ?? ''}</span>
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
