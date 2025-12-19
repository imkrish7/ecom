import { http } from "@/lib/http";

export const fetchStats = async <T>(): Promise<T> => {
  const response = await http<T>("/api/admin/stats", {
    method: "GET",
  });
  return response;
};
