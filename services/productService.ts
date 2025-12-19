import { http } from "@/lib/http";
import { z } from "zod";
import { orderSchema } from "@/schema/order.schema";

export const fetchProducts = async <T>(): Promise<T> => {
  const products = await http<T>("/api/products", { method: "GET" });
  return products;
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await http("/api/orders/cart", {
    method: "POST",
    body: JSON.stringify({ item: { productId, quantity } }),
  });
  return response;
};

export const fetchCart = async <T>(): Promise<T> => {
  const response = await http<{ products: T }>("/api/orders/cart", {
    method: "GET",
  });
  return response.products;
};

export const selectToOrder = async (productId: string, isSelected: boolean) => {
  const response = await http(`/api/orders/cart/${productId}`, {
    method: "POST",
    body: JSON.stringify({ isSelected }),
  });
  return response;
};

export const removeFromCart = async (productId: string) => {
  const response = await http(`/api/orders/cart/${productId}`, {
    method: "DELETE",
  });
  return response;
};

export const getOrderTotal = async <T>(): Promise<T> => {
  const response = await http<T>("/api/orders/prices", {
    method: "GET",
  });

  return response;
};

export const getAllAvailableCoupon = async <T>(): Promise<T> => {
  const response = await http<T>("/api/orders/discounts", {
    method: "GET",
  });
  return response;
};

export const applyDiscount = async <T>(
  code: string,
  total: number,
): Promise<T> => {
  const response = await http<T>("/api/orders/discounts", {
    method: "POST",
    body: JSON.stringify({ code, total }),
  });
  return response;
};

export const processPayment = async (data: z.infer<typeof orderSchema>) => {
  const response = await http("/api/orders/checkout", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};
