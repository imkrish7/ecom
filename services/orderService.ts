import { http } from "@/lib/http";
export const orderByUser = async <T>(): Promise<T> => {
  const response = await http<T>("/api/orders", {
    method: "GET",
  });
  return response;
};
