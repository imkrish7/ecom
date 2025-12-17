import { http } from "@/lib/http";

export const fetchProducts = async <T>(): Promise<T> => {
  const products = await http<T>("/api/products", { method: "GET" });
  return products;
};
