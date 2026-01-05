import React, { useState, useEffect, useMemo } from "react";
import { fetchOrders, AppOrder } from "../api/orders";
import { KPICard } from "../components/Dashboard/KPICard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Download,
  Loader2,
  Search,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- Styled Components (Attio Style) ---
const AttioButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }
> = ({ children, className = "", variant = "secondary", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 h-9 px-4 shadow-sm border";
  const variants = {
    primary:
      "bg-primary text-primary-foreground border-transparent hover:bg-primary/90",
    secondary:
      "bg-background text-foreground border-border hover:bg-muted/50 dark:hover:bg-muted/30",
    ghost:
      "bg-transparent text-muted-foreground border-transparent shadow-none hover:bg-muted/50 hover:text-foreground",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const AttioTab: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  count?: number;
}> = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`
      relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap
      ${
        active
          ? "bg-muted text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }
    `}
  >
    {children}
    {count !== undefined && (
      <span
        className={`flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] rounded-full ${
          active
            ? "bg-background text-foreground shadow-sm"
            : "bg-muted-foreground/10 text-muted-foreground"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

export const Orders: React.FC = () => {
  // Filters & State
  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "Delivered" | "Cancelled"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<AppOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ORDERS_PER_PAGE = 50;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Calculations for KPI Cards
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      avgOrderValue,
    };
  }, [orders]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = activeTab === "All" ? true : o.status === activeTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        o.customerName.toLowerCase().includes(searchLower) ||
        o.id.toString().includes(searchLower);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Pagination Logic
  const paginationData = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
    const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
    const endIndex = startIndex + ORDERS_PER_PAGE;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      totalOrders,
      totalPages,
      startIndex,
      endIndex,
      paginatedOrders,
      showingStart: totalOrders > 0 ? startIndex + 1 : 0,
      showingEnd: Math.min(endIndex, totalOrders),
    };
  }, [filteredOrders, currentPage, ORDERS_PER_PAGE]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleExport = () => {
    const headers = ["Order ID", "Date", "Customer", "Total", "Status"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.date,
      o.customerName,
      o.total.toFixed(2),
      o.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "orders.csv";
    link.click();
  };

  const goToNextPage = () => {
    if (currentPage < paginationData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered":
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getCount = (status: string) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Orders
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and track all your orders in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AttioButton
            onClick={handleExport}
            className="shrink-0 w-full sm:w-auto"
          >
            <Download className="w-4 h-4 sm:mr-2 text-muted-foreground" />
            <span className="sm:inline">Export</span>
          </AttioButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
        />
        <KPICard label="Total Orders" value={stats.totalOrders.toString()} />
        <KPICard
          label="Pending Orders"
          value={stats.pendingOrders.toString()}
        />
        <KPICard
          label="Avg. Order Value"
          value={`₹${stats.avgOrderValue.toFixed(0)}`}
        />
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11 sm:h-10 w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <AttioTab
            active={activeTab === "All"}
            count={orders.length}
            onClick={() => setActiveTab("All")}
          >
            All Orders
          </AttioTab>
          <AttioTab
            active={activeTab === "Pending"}
            count={getCount("Pending")}
            onClick={() => setActiveTab("Pending")}
          >
            Pending
          </AttioTab>
          <AttioTab
            active={activeTab === "Delivered"}
            count={getCount("Delivered")}
            onClick={() => setActiveTab("Delivered")}
          >
            Delivered
          </AttioTab>
          <AttioTab
            active={activeTab === "Cancelled"}
            count={getCount("Cancelled")}
            onClick={() => setActiveTab("Cancelled")}
          >
            Cancelled
          </AttioTab>
        </div>
      </div>

      {/* Pagination Controls */}
      {paginationData.totalOrders > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 py-3 px-1">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {paginationData.showingStart}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {paginationData.showingEnd}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {paginationData.totalOrders}
            </span>{" "}
            orders
          </div>

          {paginationData.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <AttioButton
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="shrink-0"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </AttioButton>

              <div className="flex items-center gap-1.5 px-3">
                <span className="text-sm font-medium text-foreground">
                  {currentPage}
                </span>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">
                  {paginationData.totalPages}
                </span>
              </div>

              <AttioButton
                onClick={goToNextPage}
                disabled={currentPage === paginationData.totalPages}
                className="shrink-0"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </AttioButton>
            </div>
          )}
        </div>
      )}

      {/* --- MOBILE CARD LIST (Visible on small screens) --- */}
      <div className="md:hidden space-y-3">
        {paginationData.paginatedOrders.length > 0 ? (
          paginationData.paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                  {order.customerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground text-sm leading-tight">
                      {order.customerName}
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Order #{order.id} · {order.date}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusVariant(order.status) as any}
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      {order.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <div
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="text-sm font-semibold text-foreground">
                      {order.items}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-sm font-semibold text-foreground">
                      ₹{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Filter className="w-12 h-12 mb-4 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground mb-4">
              No orders found.
            </p>
            <AttioButton
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("All");
              }}
            >
              Clear Filters
            </AttioButton>
          </div>
        )}
      </div>

      {/* --- DESKTOP TABLE VIEW (Visible on medium+ screens) --- */}
      <div className="hidden md:block">
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50">
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground group">
                    <div className="flex items-center gap-1">
                      Order ID{" "}
                      <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>

              <tbody className="bg-card divide-y divide-border">
                {paginationData.paginatedOrders.length > 0 ? (
                  paginationData.paginatedOrders.map((order) => {
                    return (
                      <tr
                        key={order.id}
                        className="group transition-colors cursor-default hover:bg-muted/50"
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground text-sm">
                            #{order.id}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <Badge
                            variant={getStatusVariant(order.status) as any}
                          >
                            {order.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                              {order.customerName.charAt(0)}
                            </div>
                            <span className="text-sm text-foreground font-medium">
                              {order.customerName}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">
                          {order.date}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ring-2 ring-opacity-20 ${
                                order.paymentStatus === "Paid"
                                  ? "bg-emerald-500 ring-emerald-500"
                                  : "bg-amber-500 ring-amber-500"
                              }`}
                            />
                            {order.paymentStatus}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-right font-medium text-foreground tabular-nums">
                          ₹{order.total.toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-16 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Filter className="w-12 h-12 text-muted-foreground/20" />
                        <p>No orders found matching your filters.</p>
                        <AttioButton
                          variant="ghost"
                          onClick={() => {
                            setSearchQuery("");
                            setActiveTab("All");
                          }}
                        >
                          Clear Filters
                        </AttioButton>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
