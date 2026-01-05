import { API_BASE } from "./common";

export interface ShopifyCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  orders_count: number;
  total_spent: string;
  tags: string;
  created_at: string;
  last_order_id: number | null;
}

export interface AppCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrderDate: string; // approximate from creation if not available
  tags: string[];
}

export const fetchCustomers = async (): Promise<AppCustomer[]> => {
  try {
    const response = await fetch(`${API_BASE}/customers.json?limit=250`);
    if (!response.ok) throw new Error("Failed to fetch customers");
    const data = await response.json();

    return data.customers.map((customer: ShopifyCustomer) => {
      const firstName = customer.first_name || "";
      const lastName = customer.last_name || "";
      let fullName = `${firstName} ${lastName}`.trim();

      if (!fullName && customer.email) {
        fullName = customer.email.split("@")[0];
      } else if (!fullName) {
        fullName = "Guest Customer";
      }

      return {
        id: customer.id.toString(),
        name: fullName,
        email: customer.email,
        orders: customer.orders_count,
        spent: parseFloat(customer.total_spent),
        lastOrderDate: new Date(customer.created_at).toLocaleDateString(), // Simplification
        tags: customer.tags
          ? customer.tags.split(",").map((t) => t.trim())
          : [],
      };
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};
