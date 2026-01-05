import { API_BASE } from "./common";

export interface ShopifyOrder {
  id: number;
  name: string;
  email: string;
  created_at: string;
  total_price: string;
  subtotal_price: string;
  financial_status: string;
  fulfillment_status: string | null;
  currency: string;
  landing_site: string | null;
  referring_site: string | null;
  customer: {
    first_name: string;
    last_name: string;
  } | null;
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
  }>;
}

export interface AppOrder {
  id: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  date: string;
  items: number;
  landingSite: string;
  referrer: string;
  lineItems: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

function mapFulfillmentStatus(status: string | null): string {
  if (!status) return "Pending";
  if (status === "fulfilled") return "Delivered"; // Simplified mapping
  if (status === "partial") return "Shipped";
  return "Pending";
}

function mapFinancialStatus(status: string): string {
  if (status === "paid") return "Paid";
  if (status === "pending") return "Pending";
  if (status === "refunded") return "Refunded";
  return "Failed";
}

export const fetchOrders = async (): Promise<AppOrder[]> => {
  try {
    const response = await fetch(
      `${API_BASE}/orders.json?status=any&limit=250`
    );
    if (!response.ok) throw new Error("Failed to fetch orders");
    const data = await response.json();

    return data.orders.map((order: ShopifyOrder) => ({
      id: order.name,
      customerName: order.customer
        ? (() => {
            const first = order.customer.first_name || "";
            const last = order.customer.last_name || "";
            const full = `${first} ${last}`.trim();
            // Order API response might differ slightly in structure for 'email', usually it's on the order root, not always on customer object in some API versions, but let's check order.email if customer name is missing.
            // Actually, ShopifyOrder interface has email on root.
            return full || (order.email ? order.email.split("@")[0] : "Guest");
          })()
        : "Guest",
      total: parseFloat(order.total_price),
      status: mapFulfillmentStatus(order.fulfillment_status),
      paymentStatus: mapFinancialStatus(order.financial_status),
      date: new Date(order.created_at).toLocaleDateString(),
      items: order.line_items.length,
      landingSite: order.landing_site || "/",
      referrer: order.referring_site
        ? new URL(order.referring_site).hostname
        : "Direct",
      lineItems: order.line_items.map((item) => ({
        id: item.id.toString(),
        name: item.title,
        quantity: item.quantity,
        price: parseFloat(item.price),
      })),
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
