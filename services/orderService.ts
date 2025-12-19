import { http } from "@/lib/http";
export const orderByUser = async () => {
  const response = await http("/api/orders", {
    method: "GET",
  });
  return response;
};
