import { API_BASE } from "./common";

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  status: string;
  tags: string; // "tag1, tag 2, tag3"
  images: Array<{
    src: string;
  }>;
  variants: Array<{
    id: number;
    price: string;
    inventory_quantity: number;
    sku: string;
  }>;
}

export interface AppProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  image: string;
  sales: number;
}

export const fetchProducts = async (): Promise<AppProduct[]> => {
  try {
    const response = await fetch(`${API_BASE}/products.json?limit=250`);
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();

    return data.products.map((product: ShopifyProduct) => {
      const totalInventory = product.variants.reduce(
        (acc, v) => acc + v.inventory_quantity,
        0
      );
      const price =
        product.variants.length > 0 ? parseFloat(product.variants[0].price) : 0;

      // Logic: Use product_type if available, otherwise take the first tag, otherwise "Uncategorized"
      let category = product.product_type;
      if (!category && product.tags) {
        const firstTag = product.tags.split(",")[0].trim();
        if (firstTag) category = firstTag;
      }

      return {
        id: product.id.toString(),
        name: product.title,
        price: price,
        stock: totalInventory,
        category: category || "Uncategorized",
        status: product.status === "active" ? "Active" : "Draft",
        image:
          product.images.length > 0
            ? product.images[0].src
            : "https://placehold.co/100",
        sales: 0,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
