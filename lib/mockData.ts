import { Order, Product, Customer, ChartDataPoint, InventoryItem, OrderItem, FulfillmentOrder, AbandonedCart, PageStat, ReferrerStat, DiscountCode } from '../types';

// Helpers
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
const randomChoice = <T>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Constants
const STATUSES = ['Pending', 'Shipped', 'Delivered', 'Cancelled'] as const;
const PAYMENT_STATUSES = ['Paid', 'Pending', 'Failed', 'Refunded'] as const;
const NAMES = ['Alice Smith', 'Bob Jones', 'Charlie Brown', 'Diana Prince', 'Evan Wright', 'Fiona Gallagher', 'George Michael', 'Hannah Montana', 'Ian Somerhalder', 'Julia Roberts'];
const PRODUCTS = [
  'Classic T-Shirt', 'Denim Jacket', 'Leather Boots', 'Running Shoes', 'Wool Scarf', 
  'Cotton Socks', 'Baseball Cap', 'Sunglasses', 'Wristwatch', 'Backpack',
  'Hoodie', 'Chino Pants', 'Belt', 'Wallet', 'Beanie'
];

// Generators
export const generateOrders = (count: number): Order[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `ORD-${1000 + i}`,
    customerName: randomChoice(NAMES),
    total: randomFloat(20, 500),
    status: randomChoice(STATUSES),
    paymentStatus: randomChoice(PAYMENT_STATUSES),
    date: randomDate(new Date(2023, 0, 1), new Date()),
    items: randomInt(1, 5)
  }));
};

export const generateProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `PROD-${1000 + i}`,
    name: PRODUCTS[i % PRODUCTS.length] + (i > PRODUCTS.length ? ` ${i}` : ''),
    price: randomFloat(10, 200),
    stock: randomInt(0, 150),
    category: randomChoice(['Apparel', 'Accessories', 'Footwear']),
    status: randomChoice(['Active', 'Draft', 'Archived']),
    image: `https://picsum.photos/seed/${i}/100/100`,
    sales: randomInt(0, 1000)
  }));
};

export const generateOrderItems = (count: number): OrderItem[] => {
  return Array.from({ length: count }).map((_, i) => {
    const product = randomChoice(PRODUCTS);
    const quantity = randomInt(1, 10);
    const price = randomFloat(15, 150);
    const isDiscounted = Math.random() > 0.6;
    const discount = isDiscounted ? parseFloat((price * quantity * 0.15).toFixed(2)) : 0;
    const netRevenue = parseFloat((price * quantity - discount).toFixed(2));
    
    return {
      id: `ITEM-${5000 + i}`,
      productName: product,
      quantity,
      price,
      discount,
      netRevenue,
      date: randomDate(new Date(2023, 0, 1), new Date())
    };
  });
};

export const generateInventory = (products: Product[]): InventoryItem[] => {
  return products.map(p => {
    // Force some items to be low stock or out of stock for demo purposes
    let stock = p.stock;
    if (Math.random() > 0.8) stock = 0;
    else if (Math.random() > 0.7) stock = randomInt(1, 9);

    return {
      ...p,
      stock: stock,
      sku: `SKU-${p.id.split('-')[1]}-${randomInt(100, 999)}`,
      lowStockThreshold: 10
    };
  });
};

export const generateCustomers = (count: number): Customer[] => {
  return Array.from({ length: count }).map((_, i) => {
    const name = randomChoice(NAMES);
    return {
      id: `CUST-${1000 + i}`,
      name: name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      orders: randomInt(1, 20),
      spent: randomFloat(100, 5000),
      lastOrderDate: randomDate(new Date(2023, 0, 1), new Date()),
      tags: [randomChoice(['VIP', 'New', 'Returning']), randomChoice(['High Value', 'Low Value'])]
    };
  });
};

export const generateFulfillmentOrders = (count: number): FulfillmentOrder[] => {
  const PARTNERS = ['FedEx', 'UPS', 'DHL', 'USPS'] as const;
  const STATUSES = ['Pending', 'Shipped', 'Delivered', 'Failed'] as const;

  return Array.from({ length: count }).map((_, i) => {
    const status = randomChoice(STATUSES);
    const dateOffset = randomInt(-10, 10);
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + dateOffset);
    
    const lastUpdateDate = new Date();
    lastUpdateDate.setDate(lastUpdateDate.getDate() - randomInt(0, 5));

    return {
      orderId: `ORD-${2000 + i}`,
      customerName: randomChoice(NAMES),
      partner: randomChoice(PARTNERS),
      status: status,
      estimatedDelivery: estDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUpdate: `${lastUpdateDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${randomInt(8, 20)}:00`,
      deliveryTimeDays: randomInt(1, 10)
    };
  });
};

export const generateAbandonedCarts = (count: number): AbandonedCart[] => {
  return Array.from({ length: count }).map((_, i) => {
    const name = randomChoice(NAMES);
    const itemCount = randomInt(1, 4);
    const cartItems = [];
    let totalValue = 0;

    for (let j = 0; j < itemCount; j++) {
      const pName = randomChoice(PRODUCTS);
      const pPrice = randomFloat(20, 150);
      cartItems.push({
        name: pName,
        price: pPrice,
        image: `https://picsum.photos/seed/${randomInt(1, 1000)}/50/50`
      });
      totalValue += pPrice;
    }

    const hoursAgo = randomInt(1, 48);
    const date = new Date();
    date.setHours(date.getHours() - hoursAgo);

    return {
      id: `CART-${8000 + i}`,
      customerName: name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      items: cartItems,
      itemCount: itemCount,
      totalValue: parseFloat(totalValue.toFixed(2)),
      abandonedDate: date.toISOString(),
      timeAgo: hoursAgo < 24 ? `${hoursAgo} hours ago` : `${Math.floor(hoursAgo / 24)} days ago`
    };
  });
};

export const generateRevenueData = (days: number): ChartDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: randomInt(500, 5000),
      value2: randomInt(20, 100) // Orders
    });
  }
  return data;
};

export const generateTrafficData = (days: number): ChartDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: randomInt(2000, 8000), // Page Views
      value2: randomInt(1000, 4000) // Unique Visitors
    });
  }
  return data;
};

export const generateDiscountCodes = (): DiscountCode[] => {
  const codes = [
    { code: 'WELCOME10', type: 'Percentage', val: 10, status: 'Active' },
    { code: 'SUMMER25', type: 'Percentage', val: 25, status: 'Active' },
    { code: 'FREESHIP', type: 'Fixed', val: 15, status: 'Active' },
    { code: 'VIPMEMBER', type: 'Percentage', val: 20, status: 'Active' },
    { code: 'FLASH50', type: 'Percentage', val: 50, status: 'Expired' },
    { code: 'SAVE5', type: 'Fixed', val: 5, status: 'Active' },
    { code: 'BFCM2022', type: 'Percentage', val: 30, status: 'Expired' },
    { code: 'NEWYEAR', type: 'Percentage', val: 15, status: 'Scheduled' },
    { code: 'LOYALTY', type: 'Fixed', val: 25, status: 'Active' },
    { code: 'SORRY20', type: 'Percentage', val: 20, status: 'Active' },
  ];

  return codes.map((c, i) => {
    const expiryDate = new Date();
    if (c.status === 'Expired') expiryDate.setDate(expiryDate.getDate() - randomInt(10, 100));
    else if (c.status === 'Scheduled') expiryDate.setDate(expiryDate.getDate() + randomInt(30, 60));
    else expiryDate.setDate(expiryDate.getDate() + randomInt(5, 180));

    return {
      id: `DSC-${1000 + i}`,
      code: c.code,
      discountType: c.type as 'Percentage' | 'Fixed',
      value: c.val,
      usageCount: c.status === 'Scheduled' ? 0 : randomInt(50, 2000),
      revenueGenerated: c.status === 'Scheduled' ? 0 : randomFloat(5000, 150000),
      status: c.status as 'Active' | 'Expired' | 'Scheduled',
      expiryDate: expiryDate.toISOString().split('T')[0]
    };
  });
};

export const generateDiscountUsage = (days: number): ChartDataPoint[] => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: randomInt(10, 150), // Usage count
    });
  }
  return data;
};

// Mock Data Sets
export const mockOrders = generateOrders(100);
export const mockProducts = generateProducts(20);
export const mockOrderItems = generateOrderItems(200);
export const mockInventory = generateInventory(mockProducts);
export const mockCustomers = generateCustomers(50);
export const mockFulfillmentOrders = generateFulfillmentOrders(50);
export const mockAbandonedCarts = generateAbandonedCarts(30);
export const mockRevenueData = generateRevenueData(30);
export const mockTrafficData = generateTrafficData(30);
export const mockDiscountCodes = generateDiscountCodes();
export const mockDiscountUsage = generateDiscountUsage(30);

export const mockTopPages: PageStat[] = [
  { path: '/', views: 45000, visitors: 32000 },
  { path: '/products', views: 28000, visitors: 18000 },
  { path: '/cart', views: 12000, visitors: 8000 },
  { path: '/checkout', views: 5000, visitors: 4200 },
  { path: '/blog/summer-trends', views: 3500, visitors: 3000 },
  { path: '/about-us', views: 2000, visitors: 1500 },
];

export const mockReferrers: ReferrerStat[] = [
  { source: 'Google', visits: 45000 },
  { source: 'Direct', visits: 25000 },
  { source: 'Instagram', visits: 15000 },
  { source: 'Facebook', visits: 8000 },
  { source: 'Twitter', visits: 4000 },
  { source: 'Email', visits: 3000 },
];

export const kpiData = {
  revenue: { label: 'Total Revenue', value: '$124,500', change: 12.5, trend: 'up' as const },
  orders: { label: 'Total Orders', value: '1,240', change: 8.2, trend: 'up' as const },
  conversion: { label: 'Conversion Rate', value: '3.2%', change: -1.1, trend: 'down' as const },
  aov: { label: 'Avg Order Value', value: '$100.40', change: 2.4, trend: 'up' as const },
};

export const trafficKPIs = {
  views: { label: 'Page Views', value: '124,592', change: 12.5, trend: 'up' as const },
  visitors: { label: 'Unique Visitors', value: '68,402', change: 8.1, trend: 'up' as const },
  duration: { label: 'Avg. Session', value: '2m 45s', change: 1.2, trend: 'up' as const },
  bounce: { label: 'Bounce Rate', value: '42.3%', change: -2.5, trend: 'down' as const },
};