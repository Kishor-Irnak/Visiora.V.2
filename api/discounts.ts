import { API_BASE } from "./common";

export interface AppDiscountCode {
  id: string;
  code: string;
  discountType: "Percentage" | "Fixed";
  value: number;
  usageCount: number;
  revenueGenerated: number;
  status: "Active" | "Expired" | "Scheduled";
  expiryDate: string;
}

function getDiscountStatus(rule: any): "Active" | "Expired" | "Scheduled" {
  const now = new Date();
  const start = new Date(rule.starts_at);
  const end = rule.ends_at ? new Date(rule.ends_at) : null;

  if (start > now) return "Scheduled";
  if (end && end < now) return "Expired";
  return "Active";
}

export const fetchDiscountCodes = async (): Promise<AppDiscountCode[]> => {
  try {
    const response = await fetch(`${API_BASE}/price_rules.json?limit=50`);
    if (!response.ok) return [];
    const data = await response.json();

    return data.price_rules.map((rule: any) => ({
      id: rule.id.toString(),
      code: rule.title,
      discountType: rule.value_type === "percentage" ? "Percentage" : "Fixed",
      value: Math.abs(parseFloat(rule.value)),
      usageCount: rule.usage_count,
      revenueGenerated: 0,
      status: getDiscountStatus(rule),
      expiryDate: rule.ends_at
        ? new Date(rule.ends_at).toLocaleDateString()
        : "Never",
    }));
  } catch (e) {
    console.warn("Failed to fetch discounts", e);
    return [];
  }
};
