import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { KPICard } from '../components/Dashboard/KPICard';
import { trafficKPIs, mockTrafficData, mockTopPages, mockReferrers } from '../lib/mockData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

export const WebsiteTraffic: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard {...trafficKPIs.views} />
        <KPICard {...trafficKPIs.visitors} />
        <KPICard {...trafficKPIs.duration} />
        <KPICard {...trafficKPIs.bounce} />
      </div>

      {/* Traffic Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Over Time</CardTitle>
          <CardDescription>Page views and unique visitors for the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrafficData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="value" name="Page Views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                <Area type="monotone" dataKey="value2" name="Unique Visitors" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorVisitors)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages by path.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTopPages} layout="vertical" margin={{ left: 40, right: 20 }}>
                   <XAxis type="number" hide />
                   <YAxis type="category" dataKey="path" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={120} />
                   <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                   />
                   <Bar dataKey="views" name="Page Views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Referrer Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors are coming from.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={mockReferrers}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="visits"
                      nameKey="source"
                    >
                      {mockReferrers.map((entry, index) => {
                        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    />
                 </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {mockReferrers.map((ref, index) => {
                     const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];
                     return (
                         <div key={ref.source} className="flex items-center gap-2 text-sm text-muted-foreground">
                             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                             {ref.source}
                         </div>
                     )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};