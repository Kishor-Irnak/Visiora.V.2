import React from "react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { mockCustomers } from "../lib/mockData";
import { Mail, ArrowUpRight } from "lucide-react";
import { KPICard } from "../components/Dashboard/KPICard";

export const Customers: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <KPICard
          label="Total Customers"
          value={mockCustomers.length}
          change={12}
          trend="up"
        />
        <KPICard label="Returning Rate" value="42%" change={-2} trend="down" />
        <KPICard
          label="Avg Lifetime Value"
          value="$420.50"
          change={5.4}
          trend="up"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Orders</th>
                <th className="px-6 py-3">Spent</th>
                <th className="px-6 py-3">Last Order</th>
                <th className="px-6 py-3">Tags</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{customer.name}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {customer.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{customer.orders}</td>
                  <td className="px-6 py-4 font-medium">
                    ${customer.spent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {customer.lastOrderDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {customer.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-[10px] h-5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground hover:text-primary cursor-pointer" />
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
