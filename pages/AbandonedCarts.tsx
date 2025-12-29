import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { mockAbandonedCarts } from '../lib/mockData';
import { KPICard } from '../components/Dashboard/KPICard';
import { Mail, Tag, Target, Clock, ShoppingBag } from 'lucide-react';

export const AbandonedCarts: React.FC = () => {

  const stats = useMemo(() => {
    const sessions = mockAbandonedCarts.length;
    const potentialRevenue = mockAbandonedCarts.reduce((acc, cart) => acc + cart.totalValue, 0);
    // Mock recovery rate derived loosely or static
    const recoveryRate = 18.5; 

    return { sessions, potentialRevenue, recoveryRate };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Metrics Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <KPICard 
          label="Abandoned Sessions" 
          value={stats.sessions} 
          change={12.5} 
          trend="up" 
        />
        <KPICard 
          label="Potential Revenue" 
          value={`$${stats.potentialRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          change={-2.4} 
          trend="down" 
        />
        <KPICard 
          label="Recovery Rate" 
          value={`${stats.recoveryRate}%`} 
          change={4.1} 
          trend="up" 
        />
      </div>

      {/* Main Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Abandoned Carts</CardTitle>
          <CardDescription>Review and recover carts abandoned in the last 48 hours.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">User / Email</th>
                <th className="px-6 py-3">Cart Products</th>
                <th className="px-6 py-3">Cart Value</th>
                <th className="px-6 py-3">Abandoned Time</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockAbandonedCarts.map(cart => (
                <tr key={cart.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{cart.customerName}</span>
                      <span className="text-xs text-muted-foreground">{cart.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2 overflow-hidden">
                         {cart.items.slice(0, 3).map((item, i) => (
                           <img 
                            key={i} 
                            src={item.image} 
                            alt={item.name} 
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover" 
                           />
                         ))}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-medium truncate max-w-[150px]">{cart.items[0].name}</span>
                         {cart.items.length > 1 && (
                            <span className="text-xs text-muted-foreground">+{cart.items.length - 1} more items</span>
                         )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${cart.totalValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {cart.timeAgo}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" title="Send Reminder">
                            <Mail className="h-4 w-4 mr-1" />
                            <span className="hidden xl:inline">Remind</span>
                        </Button>
                        <Button variant="outline" size="sm" title="Apply Discount">
                            <Tag className="h-4 w-4 mr-1" />
                            <span className="hidden xl:inline">Discount</span>
                        </Button>
                        <Button variant="outline" size="sm" title="Retarget Ad">
                            <Target className="h-4 w-4 mr-1" />
                            <span className="hidden xl:inline">Retarget</span>
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};