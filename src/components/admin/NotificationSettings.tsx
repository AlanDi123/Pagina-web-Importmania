'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'react-hot-toast';

interface NotificationTypeConfig {
  type: string;
  label: string;
  inApp: boolean;
  email: boolean;
  push: boolean;
  whatsapp: boolean;
}

const NOTIFICATION_TYPES: NotificationTypeConfig[] = [
  { type: 'NEW_ORDER', label: 'Nuevo pedido', inApp: true, email: true, push: false, whatsapp: false },
  { type: 'PAYMENT_RECEIVED', label: 'Pago recibido', inApp: true, email: true, push: false, whatsapp: false },
  { type: 'ORDER_SHIPPED', label: 'Pedido enviado', inApp: true, email: true, push: false, whatsapp: true },
  { type: 'ORDER_DELIVERED', label: 'Pedido entregado', inApp: true, email: false, push: false, whatsapp: false },
  { type: 'LOW_STOCK', label: 'Stock bajo', inApp: true, email: true, push: false, whatsapp: false },
  { type: 'NEW_REVIEW', label: 'Nueva reseña', inApp: true, email: false, push: false, whatsapp: false },
  { type: 'NEW_USER', label: 'Nuevo usuario', inApp: true, email: false, push: false, whatsapp: false },
  { type: 'ABANDONED_CART', label: 'Carrito abandonado', inApp: false, email: true, push: false, whatsapp: false },
  { type: 'REFERRAL_COMPLETED', label: 'Referido completado', inApp: true, email: true, push: false, whatsapp: false },
];

export function NotificationSettings() {
  const [configs, setConfigs] = useState<NotificationTypeConfig[]>(NOTIFICATION_TYPES);
  const [adminEmail, setAdminEmail] = useState('');

  const handleToggle = (type: string, channel: keyof Omit<NotificationTypeConfig, 'type' | 'label'>) => {
    setConfigs((prev) =>
      prev.map((config) =>
        config.type === type ? { ...config, [channel]: !config[channel] } : config
      )
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/notificaciones/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail,
          notificationConfig: configs,
        }),
      });

      if (!response.ok) throw new Error('Error al guardar');

      toast.success('Configuración guardada');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Email del admin */}
      <Card>
        <CardHeader>
          <CardTitle>Email de notificaciones</CardTitle>
          <CardDescription>
            Email donde se recibirán las notificaciones del admin
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="adminEmail">Email</Label>
            <Input
              id="adminEmail"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@importmania.com.ar"
            />
          </div>
          <Button onClick={handleSave}>Guardar email</Button>
        </CardContent>
      </Card>

      {/* Configuración por tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones por evento</CardTitle>
          <CardDescription>
            Configurá qué canales usar para cada tipo de notificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead className="text-center">In-App</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Push</TableHead>
                <TableHead className="text-center">WhatsApp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.map((config) => (
                <TableRow key={config.type}>
                  <TableCell className="font-medium">{config.label}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={config.inApp}
                      onCheckedChange={() => handleToggle(config.type, 'inApp')}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={config.email}
                      onCheckedChange={() => handleToggle(config.type, 'email')}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={config.push}
                      onCheckedChange={() => handleToggle(config.type, 'push')}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={config.whatsapp}
                      onCheckedChange={() => handleToggle(config.type, 'whatsapp')}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Guardar configuración</Button>
    </div>
  );
}

export default NotificationSettings;
