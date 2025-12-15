import "server-only";
import { z } from "zod";

export const cartSchema = z.object({
  items: z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1).max(100),
  }),
});
