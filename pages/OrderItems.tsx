import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { mockOrderItems } from '../lib/mockData';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';

export const OrderItems: React.FC = () => {
  
  // Analytics Logic
  const analytics = useMemo(() => {
    const productStats: Record<string, { name: string; quantity: number; revenue: number; discount: number }> = {};

    mockOrderItems.forEach(item => {
      if (!productStats[item.productName]) {
        productStats[item.productName] = { name: item.productName, quantity: 0, revenue: 0, discount: 0 };
      }
      productStats[item.productName].quantity += item.quantity;
      productStats[item.productName].revenue += item.netRevenue;
      productStats[item.productName].discount += item.discount;
    });

    const productsArray = Object.values(productStats);

    const mostSold = [...productsArray].sort((a, b) => b.quantity - a.quantity).slice(0, 6);
    const revenueByProduct = [...productsArray].sort((a, b) => b.revenue - a.revenue).slice(0, 10);
    
    return { mostSold, revenueByProduct };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Analytics Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most Sold Products</CardTitle>
            <CardDescription>Top performing products by quantity sold.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.mostSold} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                    {analytics.mostSold.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index < 3 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discount Impact</CardTitle>
            <CardDescription>Net Revenue vs Discount Applied for top products.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.revenueByProduct.slice(0, 6)}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Net Revenue" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="discount" name="Discount Applied" stackId="a" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>Detailed breakdown of individual line items sold.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3 text-right">Qty</th>
                <th className="px-6 py-3 text-right">Unit Price</th>
                <th className="px-6 py-3 text-right">Discount</th>
                <th className="px-6 py-3 text-right">Net Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockOrderItems.slice(0, 50).map(item => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    {item.productName}
                    <div className="text-xs text-muted-foreground font-normal">{item.id} • {item.date}</div>
                  </td>
                  <td className="px-6 py-4 text-right">{item.quantity}</td>
                  <td className="px-6 py-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-red-500">
                    {item.discount > 0 ? `-$${item.discount.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">${item.netRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};