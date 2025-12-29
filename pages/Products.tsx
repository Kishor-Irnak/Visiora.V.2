import React from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { mockProducts } from "../lib/mockData";
import { Plus, MoreHorizontal } from "lucide-react";

export const Products: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">{/* Filters could go here */}</div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Inventory</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Sales</th>
                <th className="px-6 py-3 text-right">Price</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={product.image}
                        alt=""
                        className="h-10 w-10 rounded-md border object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        product.status === "Active" ? "success" : "secondary"
                      }
                    >
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        product.stock < 10 ? "text-red-500 font-medium" : ""
                      }
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.sales} sold</td>
                  <td className="px-6 py-4 text-right font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
