"use client";

import { http } from "@/lib/http";
import signupSchema from "@/schema/signup.schema";
import { z } from "zod";

export const login = async <T>(email: string, password: string): Promise<T> => {
  const response = await http<T>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return response;
};

export const signup = async (data: z.infer<typeof signupSchema>) => {
  const response = await http("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ ...data }),
  });
  return response;
};

export const logout = async () => {
  const response = await http("/api/user/logout", {
    method: "POST",
  });
  return response;
};
