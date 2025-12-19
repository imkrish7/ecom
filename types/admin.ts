export interface Discount {
  code: string;
  discount: number;
  discountAmount: number;
}

export interface DashboardStats {
  itemsPurchased: number;
  purchaseAmount: number;
  discounts: Discount[];
}
