import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { KPICard } from '../components/Dashboard/KPICard';
import { mockDiscountCodes, mockDiscountUsage } from '../lib/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Tag, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const DiscountCodes: React.FC = () => {

  const stats = useMemo(() => {
    const totalCodes = mockDiscountCodes.length;
    const usageCount = mockDiscountCodes.reduce((acc, code) => acc + code.usageCount, 0);
    const revenueWithDiscount = mockDiscountCodes.reduce((acc, code) => acc + code.revenueGenerated, 0);
    
    // Estimate revenue loss based on discount value type
    // This is a rough estimation for mock purposes
    const estimatedLoss = mockDiscountCodes.reduce((acc, code) => {
      if (code.discountType === 'Percentage') {
        // Assume avg order value is around 100 for calculation
        return acc + (code.usageCount * (100 * (code.value / 100)));
      } else {
        return acc + (code.usageCount * code.value);
      }
    }, 0);

    const lossPercentage = (estimatedLoss / (revenueWithDiscount + estimatedLoss)) * 100;

    return { totalCodes, usageCount, revenueWithDiscount, lossPercentage };
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Expired': return 'secondary';
      case 'Scheduled': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          label="Total Codes" 
          value={stats.totalCodes} 
          change={2} 
          trend="up" 
        />
        <KPICard 
          label="Total Usage" 
          value={stats.usageCount.toLocaleString()} 
          change={12.5} 
          trend="up" 
        />
        <KPICard 
          label="Revenue with Discount" 
          value={`$${(stats.revenueWithDiscount / 1000).toFixed(1)}k`} 
          change={8.4} 
          trend="up" 
        />
        <KPICard 
          label="Revenue Loss %" 
          value={`${stats.lossPercentage.toFixed(1)}%`} 
          change={-0.5} 
          trend="down" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Chart Section */}
        <Card className="md:col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Usage Over Time</CardTitle>
            <CardDescription>Daily redemption frequency.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockDiscountUsage} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Discounts</CardTitle>
              <CardDescription>Manage and track your promotional codes.</CardDescription>
            </div>
            <Button size="sm" variant="outline"><Tag className="mr-2 h-4 w-4"/> Create Code</Button>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                <tr>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Discount</th>
                  <th className="px-6 py-3">Usage</th>
                  <th className="px-6 py-3">Revenue</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockDiscountCodes.map(code => (
                  <tr key={code.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{code.code}</td>
                    <td className="px-6 py-4">
                      {code.discountType === 'Percentage' ? `${code.value}%` : `$${code.value}`}
                    </td>
                    <td className="px-6 py-4">{code.usageCount.toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">${code.revenueGenerated.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={getStatusVariant(code.status) as any}>
                        {code.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-muted-foreground whitespace-nowrap">
                      {code.expiryDate}
                    </td>
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