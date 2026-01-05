import React, { useEffect, useState, useMemo } from "react";
import { KPICard } from "../components/Dashboard/KPICard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
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
} from "recharts";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Calendar,
  Loader2,
  TrendingUp,
  Wallet,
  ShoppingBag,
  Package,
  CreditCard,
} from "lucide-react";
import { fetchDashboardMetrics } from "../api/dashboard";
import { AppOrder, fetchOrders } from "../api/orders";
import { AppProduct, fetchProducts } from "../api/products";

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({ totalOrders: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState<AppOrder[]>([]);
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [m, o, p] = await Promise.all([
          fetchDashboardMetrics(),
          fetchOrders(),
          fetchProducts(),
        ]);
        setMetrics(m);
        setRecentOrders(o);
        setProducts(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Derived Analytics
  const { revenueData, aov, recentRevenue } = useMemo(() => {
    const revenue = recentOrders.reduce((acc, o) => acc + o.total, 0);
    const avgOrderValue =
      recentOrders.length > 0 ? revenue / recentOrders.length : 0;

    // Group by date for chart
    const days = 30;
    const data = [];
    const now = new Date();
    const ordersByDate: Record<string, number> = {};
    const revenueByDate: Record<string, number> = {};

    recentOrders.forEach((o) => {
      const dateKey = new Date(o.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      ordersByDate[dateKey] = (ordersByDate[dateKey] || 0) + 1;
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + o.total;
    });

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      data.push({
        name: dateKey,
        value: revenueByDate[dateKey] || 0, // Revenue
        value2: ordersByDate[dateKey] || 0, // Orders
      });
    }

    return { revenueData: data, aov: avgOrderValue, recentRevenue: revenue };
  }, [recentOrders]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8 relative">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome back. Here's your store overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex border-white/10 bg-card/50 backdrop-blur-sm hover:bg-card/80"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-lg shadow-violet-500/25"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            View Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Total Revenue"
          value={`₹${recentRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          variant="gradient"
          icon={<Wallet className="h-6 w-6" />}
        />
        <KPICard
          label="Orders"
          value={metrics.totalOrders.toString()}
          variant="glass"
          icon={<ShoppingBag className="h-6 w-6" />}
        />
        <KPICard
          label="Products"
          value={metrics.totalProducts.toString()}
          variant="glass"
          icon={<Package className="h-6 w-6" />}
        />
        <KPICard
          label="Avg. Order Value"
          value={`₹${aov.toFixed(2)}`}
          variant="glass"
          icon={<CreditCard className="h-6 w-6" />}
        />
      </div>

      {/* Charts Row 1: Revenue + Recent Products */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-4 dashboard-card glass border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Revenue Trend
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  Daily revenue for the past 30 days
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(20,20,25,0.9)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#d8b4fe" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={false}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card className="col-span-1 lg:col-span-3 dashboard-card glass border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Latest Products
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Recently added to your catalog
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {products.slice(0, 5).map((product, i) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 group p-2 rounded-lg hover:bg-white/5 transition-colors -mx-2"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-white/10 bg-muted/50 shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-sm font-medium leading-none truncate group-hover:text-violet-400 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {product.category}
                    </p>
                  </div>
                  <div className="text-sm font-semibold shrink-0">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2: Recent Orders + Bar Chart */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* Recent Orders */}
        <Card className="col-span-1 lg:col-span-3 dashboard-card glass border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Orders
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Latest transactions from customers
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group px-2 hover:bg-white/5 transition-colors -mx-2 rounded-lg"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium group-hover:text-violet-400 transition-colors">
                        {order.customerName}
                      </span>
                      <Badge
                        variant={
                          order.status === "Delivered"
                            ? "success"
                            : order.status === "Pending"
                            ? "warning"
                            : "secondary"
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {order.id} · {order.items}{" "}
                      {order.items === 1 ? "item" : "items"}
                    </span>
                  </div>
                  <div className="text-sm font-semibold shrink-0 ml-4">
                    ₹{order.total.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Volume Chart */}
        <Card className="col-span-1 lg:col-span-4 dashboard-card glass border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-foreground">
              Order Volume
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              Daily order count over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(139, 92, 246, 0.1)" }}
                    contentStyle={{
                      backgroundColor: "rgba(20,20,25,0.9)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="value2"
                    name="Orders"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
