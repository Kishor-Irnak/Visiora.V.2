import { API_BASE } from "./common";

export const fetchDashboardMetrics = async () => {
  // We can aggregate from the fetches above or use count endpoints
  // For simplicity, we'll return a structure that the dashboard expects
  // fetching counts is more efficient for just numbers
  try {
    const [ordersRes, productsRes] = await Promise.all([
      fetch(`${API_BASE}/orders/count.json?status=any`),
      fetch(`${API_BASE}/products/count.json`),
    ]);

    const ordersData = await ordersRes.json();
    const productsData = await productsRes.json();

    // Revenue requires iterating orders usually, or using a report api (plus only).
    // We will sum up the recent orders fetched in fetchOrders instead for a rough number if needed,
    // or just fetching a bunch of orders to sum.
    // Let's implement a simple sum basic on the last 50 orders for now to show "something"
    // Real revenue analytics usually comes from ShopifyQL (Plus) or iterating all orders (slow).

    return {
      totalOrders: ordersData.count,
      totalProducts: productsData.count,
    };
  } catch (e) {
    console.error(e);
    return { totalOrders: 0, totalProducts: 0 };
  }
};
