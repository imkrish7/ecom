"use client";

import { http } from "@/lib/http";

export const login = async (email: string, password: string) => {
  const response = await http("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response;
};
