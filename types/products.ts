export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  cartItemId?: string;
  quantity?: number;
  selected?: boolean;
  updatedAt: string;
  createdAt: string;
}
