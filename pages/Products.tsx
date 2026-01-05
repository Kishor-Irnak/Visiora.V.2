import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "../components/ui/Badge";
import { fetchProducts, AppProduct } from "../api/products";
import {
  Plus,
  Search,
  Download,
  Filter,
  Loader2,
  MoreHorizontal,
  Package,
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

export const Products: React.FC = () => {
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 50;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.id.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  // Pagination Logic
  const paginationData = useMemo(() => {
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      totalProducts,
      totalPages,
      startIndex,
      endIndex,
      paginatedProducts,
      showingStart: totalProducts > 0 ? startIndex + 1 : 0,
      showingEnd: Math.min(endIndex, totalProducts),
    };
  }, [filteredProducts, currentPage, PRODUCTS_PER_PAGE]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleExport = () => {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];
    const rows = filteredProducts.map((p) => [
      p.id,
      p.name,
      p.category,
      p.price.toFixed(2),
      p.stock,
      p.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "products.csv";
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

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog, prices, and inventory.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AttioButton onClick={handleExport} className="shrink-0">
            <Download className="w-4 h-4 mr-2 text-muted-foreground" />
            Export
          </AttioButton>
          <AttioButton variant="primary" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </AttioButton>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name, ID, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
          />
        </div>
      </div>

      {/* Pagination Controls */}
      {paginationData.totalProducts > 0 && (
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
              {paginationData.totalProducts}
            </span>{" "}
            products
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
        {paginationData.paginatedProducts.length > 0 ? (
          paginationData.paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-16 w-16 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    ID: {product.id}
                  </p>
                  <Badge variant="outline" className="text-xs font-normal">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="text-sm font-semibold text-foreground">
                      {product.stock}
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-sm font-semibold text-foreground">
                      ₹{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    product.status === "Active" ? "success" : "secondary"
                  }
                  className="text-xs"
                >
                  {product.status}
                </Badge>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-12 h-12 mb-4 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground mb-4">
              No products found.
            </p>
            <AttioButton variant="ghost" onClick={() => setSearchQuery("")}>
              Clear Search
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
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Stock</th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>

              <tbody className="bg-card divide-y divide-border">
                {paginationData.paginatedProducts.length > 0 ? (
                  paginationData.paginatedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="group transition-colors cursor-default hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded bg-muted border border-border overflow-hidden shrink-0">
                            <img
                              src={product.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-sm text-foreground font-medium truncate max-w-[200px]">
                              {product.name}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono">
                              #{product.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <Badge variant="outline" className="font-normal">
                          {product.category}
                        </Badge>
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            product.status === "Active"
                              ? "success"
                              : "secondary"
                          }
                        >
                          {product.status}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-sm text-right font-medium text-foreground tabular-nums">
                        ₹{product.price.toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-sm text-right tabular-nums">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-medium">{product.stock}</span>
                          <span
                            className={`text-xs ${
                              product.stock === 0
                                ? "text-red-500"
                                : product.stock <= 10
                                ? "text-amber-500"
                                : "text-muted-foreground"
                            }`}
                          >
                            {product.stock === 0
                              ? "Out of Stock"
                              : product.stock <= 10
                              ? "Low Stock"
                              : "In Stock"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-16 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Filter className="w-12 h-12 text-muted-foreground/20" />
                        <p>No products found matching your search.</p>
                        <AttioButton
                          variant="ghost"
                          onClick={() => setSearchQuery("")}
                        >
                          Clear Search
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
