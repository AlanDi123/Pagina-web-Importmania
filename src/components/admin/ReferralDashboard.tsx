'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatARS } from '@/lib/formatters';
import { formatDateShort } from '@/lib/formatters';

interface Referral {
  id: string;
  referrerName: string;
  referrerEmail: string;
  referredName: string;
  referredEmail: string;
  status: 'PENDING' | 'COMPLETED' | 'REWARDED';
  rewardValue: number | null;
  createdAt: Date;
  completedAt: Date | null;
}

interface ReferralDashboardProps {
  stats: {
    totalReferrals: number;
    pendingReferrals: number;
    completedReferrals: number;
    rewardedReferrals: number;
    totalRewardsGiven: number;
  };
  referrals: Referral[];
  config: {
    enabled: boolean;
    rewardType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    rewardValue: number;
  };
}

export function ReferralDashboard({ stats, referrals, config }: ReferralDashboardProps) {
  const conversionRate =
    stats.totalReferrals > 0
      ? ((stats.completedReferrals / stats.totalReferrals) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recompensas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rewardedReferrals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatARS(stats.totalRewardsGiven)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración del programa</CardTitle>
          <CardDescription>
            Ajustá los parámetros del programa de referidos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium">Estado</p>
              <Badge variant={config.enabled ? 'default' : 'secondary'}>
                {config.enabled ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Tipo de recompensa</p>
              <p className="font-medium">
                {config.rewardType === 'PERCENTAGE' ? 'Porcentaje' : 'Monto fijo'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Valor</p>
              <p className="font-medium">
                {config.rewardType === 'PERCENTAGE'
                  ? `${config.rewardValue}%`
                  : formatARS(config.rewardValue)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm font-medium">Tasa de conversión</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de referidos */}
      <Card>
        <CardHeader>
          <CardTitle>Referidos recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referidor</TableHead>
                <TableHead>Referido</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Recompensa</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {referrals.map((ref) => (
                <TableRow key={ref.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ref.referrerName}</p>
                      <p className="text-xs text-muted-foreground">{ref.referrerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ref.referredName}</p>
                      <p className="text-xs text-muted-foreground">{ref.referredEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ref.status === 'COMPLETED'
                          ? 'default'
                          : ref.status === 'REWARDED'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {ref.status === 'PENDING'
                        ? 'Pendiente'
                        : ref.status === 'COMPLETED'
                        ? 'Completado'
                        : 'Recompensado'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ref.rewardValue ? formatARS(ref.rewardValue) : '-'}
                  </TableCell>
                  <TableCell>{formatDateShort(ref.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReferralDashboard;
