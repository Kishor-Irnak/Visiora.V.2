import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const funnelData = [
  { name: 'View Product', value: 5000, dropoff: 0, fill: '#3b82f6' },
  { name: 'Add to Cart', value: 2400, dropoff: 52, fill: '#60a5fa' },
  { name: 'Checkout', value: 1100, dropoff: 54, fill: '#93c5fd' },
  { name: 'Purchase', value: 650, dropoff: 41, fill: '#bfdbfe' },
];

export const Funnel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         {funnelData.map((step, index) => (
           <Card key={step.name}>
             <CardContent className="p-6">
               <div className="text-sm font-medium text-muted-foreground mb-2">{step.name}</div>
               <div className="text-2xl font-bold">{step.value.toLocaleString()}</div>
               {index > 0 && (
                 <div className="text-xs text-red-500 mt-2 font-medium">
                   {step.dropoff}% drop-off
                 </div>
               )}
             </CardContent>
           </Card>
         ))}
      </div>

      <Card className="h-[500px]">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Visualizing user journey drop-offs.</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={funnelData} layout="vertical" barSize={40} margin={{ left: 20 }}>
               <XAxis type="number" hide />
               <YAxis type="category" dataKey="name" stroke="#888888" fontSize={14} tickLine={false} axisLine={false} width={100}/>
               <Tooltip 
                 cursor={{fill: 'transparent'}}
                 contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
               />
               <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                 {funnelData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.fill} />
                 ))}
               </Bar>
             </BarChart>
           </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};