import { Metadata } from 'next';
import { NotificationSettings } from '@/components/admin/NotificationSettings';

export const metadata: Metadata = {
  title: 'Notificaciones',
  description: 'Configuración de notificaciones',
};

export default function NotificacionesAdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Notificaciones</h1>

      <NotificationSettings />
    </div>
  );
}
