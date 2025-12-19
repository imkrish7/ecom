import { http } from "@/lib/http";
export const me = async <T>(): Promise<T> => {
  const response = await http<T>("/api/user/me", {
    method: "GET",
  });
  return response;
};
