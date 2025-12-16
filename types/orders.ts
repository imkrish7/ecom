export interface Payment {
  orderId: string;
  amount: number;
  cardNumber: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
