import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockFulfillmentOrders } from '../lib/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Truck, CheckCircle, Clock, XCircle, Package } from 'lucide-react';

export const Fulfillment: React.FC = () => {

  const analytics = useMemo(() => {
    const counts = {
      Pending: 0,
      Shipped: 0,
      Delivered: 0,
      Failed: 0,
    };

    const deliveryDistribution = {
      '1-2 Days': 0,
      '3-5 Days': 0,
      '5-7 Days': 0,
      '7+ Days': 0,
    };

    mockFulfillmentOrders.forEach(order => {
      // Counts
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }

      // Distribution for delivered items (mock logic uses the 'deliveryTimeDays' field for all for simplicity)
      const days = order.deliveryTimeDays;
      if (days <= 2) deliveryDistribution['1-2 Days']++;
      else if (days <= 5) deliveryDistribution['3-5 Days']++;
      else if (days <= 7) deliveryDistribution['5-7 Days']++;
      else deliveryDistribution['7+ Days']++;
    });

    const chartData = Object.keys(deliveryDistribution).map(key => ({
      name: key,
      value: deliveryDistribution[key as keyof typeof deliveryDistribution],
    }));

    return { counts, chartData };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'Shipped': return 'info';
      case 'Pending': return 'warning';
      case 'Failed': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Fulfillment Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Pending</div>
              <div className="mt-2 text-3xl font-bold">{analytics.counts.Pending}</div>
            </div>
            <Clock className="h-8 w-8 text-yellow-500 opacity-60" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Shipped</div>
              <div className="mt-2 text-3xl font-bold">{analytics.counts.Shipped}</div>
            </div>
            <Truck className="h-8 w-8 text-blue-500 opacity-60" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-900/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Delivered</div>
              <div className="mt-2 text-3xl font-bold">{analytics.counts.Delivered}</div>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-60" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-900/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Failed</div>
              <div className="mt-2 text-3xl font-bold">{analytics.counts.Failed}</div>
            </div>
            <XCircle className="h-8 w-8 text-red-500 opacity-60" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Delivery Time Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Delivery Time</CardTitle>
            <CardDescription>Distribution of shipping durations.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fulfillment Table */}
        <Card className="md:col-span-2">
            <CardHeader>
            <CardTitle>Shipment Tracking</CardTitle>
            <CardDescription>Real-time status of recent shipments.</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Partner</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Est. Delivery</th>
                    <th className="px-6 py-3 text-right">Last Update</th>
                </tr>
                </thead>
                <tbody className="divide-y">
                {mockFulfillmentOrders.slice(0, 8).map(order => (
                    <tr key={order.orderId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">
                        {order.orderId}
                        <div className="text-xs text-muted-foreground font-normal">{order.customerName}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            {order.partner}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <Badge variant={getStatusColor(order.status) as any}>
                        {order.status}
                        </Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{order.estimatedDelivery}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{order.lastUpdate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </Card>
      </div>
    </div>
  );
};