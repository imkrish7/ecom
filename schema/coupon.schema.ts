import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3).max(10),
  discount: z.number().min(0).max(100),
  orderRequirements: z.number().min(0).max(1000),
});
