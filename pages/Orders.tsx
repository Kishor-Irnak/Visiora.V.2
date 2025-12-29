import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { mockOrders } from '../lib/mockData';
import { OrderStatus } from '../types';
import { Filter, Download } from 'lucide-react';

export const Orders: React.FC = () => {
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');

  const filteredOrders = filter === 'All' 
    ? mockOrders 
    : mockOrders.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
           <Button 
              variant={filter === 'All' ? 'primary' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('All')}
           >
             All
           </Button>
           {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
             <Button 
               key={status}
               variant={filter === status ? 'primary' : 'outline'} 
               size="sm"
               onClick={() => setFilter(status as OrderStatus)}
               className="hidden sm:inline-flex"
             >
               {status}
             </Button>
           ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4"/> Filter</Button>
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4"/> Export</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">Total Orders</span>
            <span className="text-2xl font-bold mt-1 text-blue-900 dark:text-blue-100">{mockOrders.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase">Pending</span>
            <span className="text-2xl font-bold mt-1">{mockOrders.filter(o => o.status === 'Pending').length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase">Delivered</span>
            <span className="text-2xl font-bold mt-1">{mockOrders.filter(o => o.status === 'Delivered').length}</span>
          </CardContent>
        </Card>
         <Card>
          <CardContent className="p-4 flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase">Cancelled</span>
            <span className="text-2xl font-bold mt-1">{mockOrders.filter(o => o.status === 'Cancelled').length}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.slice(0, 20).map(order => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">{order.customerName}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                       {order.paymentStatus}
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      order.status === 'Delivered' ? 'success' : 
                      order.status === 'Pending' ? 'warning' : 
                      order.status === 'Cancelled' ? 'destructive' : 'secondary'
                    }>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};