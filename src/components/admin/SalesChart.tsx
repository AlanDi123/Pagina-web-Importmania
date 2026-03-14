'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatARS } from '@/lib/formatters';

interface SalesChartProps {
  data: Array<{ date: string; total: number }>;
}

export function SalesChart({ data }: SalesChartProps) {
  // Formatear fechas para mostrar
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={formattedData}>
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00BFFF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
        />
        <YAxis
          className="text-xs text-muted-foreground"
          tick={{ fill: 'currentColor' }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Fecha:</span>
                    <span className="font-medium">{data.date}</span>
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium text-brand-primary">
                      {formatARS(data.total)}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#00BFFF"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorTotal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default SalesChart;
