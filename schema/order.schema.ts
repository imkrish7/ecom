import "server-only";
import { z } from "zod";

export const cartSchema = z.object({
  items: z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1).max(100),
  }),
});

export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().min(1).max(100),
    }),
  ),
  totalAmount: z.number().min(0),
  cardNumber: z.string().min(16).max(16),
});
