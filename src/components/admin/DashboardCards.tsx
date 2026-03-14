import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatARS } from '@/lib/formatters';

interface DashboardCardsProps {
  kpis: {
    salesToday: number;
    salesTodayCount: number;
    salesMonth: number;
    salesMonthCount: number;
    pendingOrders: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    newUsersMonth: number;
    conversionRate: number;
  };
}

export function DashboardCards({ kpis }: DashboardCardsProps) {
  const cards = [
    {
      title: 'Ventas de hoy',
      value: formatARS(kpis.salesToday),
      description: `${kpis.salesTodayCount} pedidos`,
      icon: '💰',
      trend: null,
    },
    {
      title: 'Ventas del mes',
      value: formatARS(kpis.salesMonth),
      description: `${kpis.salesMonthCount} pedidos`,
      icon: '📊',
      trend: null,
    },
    {
      title: 'Pedidos pendientes',
      value: kpis.pendingOrders.toString(),
      description: 'Por procesar',
      icon: '📦',
      trend: null,
    },
    {
      title: 'Sin stock',
      value: kpis.outOfStockProducts.toString(),
      description: 'Productos agotados',
      icon: '⚠️',
      trend: 'negative',
    },
    {
      title: 'Stock bajo',
      value: kpis.lowStockProducts.toString(),
      description: 'Por agotarse',
      icon: '🔔',
      trend: 'warning',
    },
    {
      title: 'Nuevos usuarios',
      value: kpis.newUsersMonth.toString(),
      description: 'Este mes',
      icon: '👥',
      trend: 'positive',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <span className="text-2xl">{card.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default DashboardCards;
