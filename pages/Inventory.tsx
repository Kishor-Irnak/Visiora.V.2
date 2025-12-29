import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { mockInventory } from "../lib/mockData";
import { KPICard } from "../components/Dashboard/KPICard";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts";
import { AlertTriangle, Package, AlertCircle } from "lucide-react";

export const Inventory: React.FC = () => {
  const stats = useMemo(() => {
    const totalSKUs = mockInventory.length;
    const lowStock = mockInventory.filter(
      (i) => i.stock > 0 && i.stock <= i.lowStockThreshold
    ).length;
    const outOfStock = mockInventory.filter((i) => i.stock === 0).length;

    // Create mock stock depletion data
    const depletionData = Array.from({ length: 14 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (13 - i));
      // Simulate a downward trend with some randomness
      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        stock: 2500 - i * 50 + Math.floor(Math.random() * 100),
      };
    });

    // Fast vs Slow
    const sortedBySales = [...mockInventory].sort((a, b) => b.sales - a.sales);
    const fastMoving = sortedBySales
      .slice(0, 5)
      .map((i) => ({ name: i.name, value: i.sales, type: "Fast" }));
    const slowMoving = sortedBySales
      .slice(-5)
      .reverse()
      .map((i) => ({ name: i.name, value: i.sales, type: "Slow" }));
    const velocityData = [...fastMoving, ...slowMoving];

    return { totalSKUs, lowStock, outOfStock, depletionData, velocityData };
  }, []);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Total SKUs
              </div>
              <div className="mt-2 text-3xl font-bold">{stats.totalSKUs}</div>
            </div>
            <Package className="h-8 w-8 text-muted-foreground opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </div>
              <div className="mt-2 text-3xl font-bold">{stats.lowStock}</div>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-muted-foreground">
                Out of Stock
              </div>
              <div className="mt-2 text-3xl font-bold">{stats.outOfStock}</div>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Stock Depletion</CardTitle>
            <CardDescription>
              Aggregate inventory levels over the last 14 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.depletionData}>
                  <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="stock"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorStock)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Velocity Analysis</CardTitle>
            <CardDescription>
              Fastest vs. Slowest moving products by sales volume.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.velocityData}
                  layout="vertical"
                  margin={{ left: 40 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stats.velocityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.type === "Fast"
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted))"
                        }
                      />
                    ))}
                  </Bar>
                  <ReferenceLine x={0} stroke="#000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>
            Real-time stock levels and sales performance.
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Stock Level</th>
                <th className="px-6 py-3 text-right">Sold Qty</th>
                <th className="px-6 py-3 text-right">Remaining</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockInventory.map((item) => {
                const stockStatus =
                  item.stock === 0
                    ? "Out of Stock"
                    : item.stock <= item.lowStockThreshold
                    ? "Low Stock"
                    : "In Stock";
                const badgeVariant =
                  stockStatus === "Out of Stock"
                    ? "destructive"
                    : stockStatus === "Low Stock"
                    ? "warning"
                    : "success";

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs">{item.sku}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt=""
                          className="h-8 w-8 rounded border object-cover mr-3"
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={badgeVariant}
                        className="whitespace-nowrap"
                      >
                        {stockStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">{item.sales}</td>
                    <td className="px-6 py-4 text-right font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <span>{item.stock}</span>
                        {/* Simple visual bar for stock level (capped at 100 for viz) */}
                        <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              stockStatus === "Low Stock"
                                ? "bg-yellow-500"
                                : stockStatus === "Out of Stock"
                                ? "bg-red-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (item.stock / 100) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
