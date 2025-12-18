import { Product } from "./products";

export interface Payment {
  orderId: string;
  amount: number;
  cardNumber: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderTotal {
  products: Product[];
  total: number;
}

export interface Coupon {
  code: string;
  discount: number;
  id: string;
  orderRequirements: number;
  updatedAt: string;
  createdAt: string;
}

export interface AppliedDiscount {
  discountedTotal: number;
  discountOnTotal: number;
  total: number;
}
