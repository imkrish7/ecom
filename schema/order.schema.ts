import { z } from "zod";

export const cartSchema = z.object({
  items: z.object({
    productId: z.string().uuid(),
    quantity: z.number().min(1).max(100),
  }),
});

export const deleteCartSchema = z.object({
  id: z.string().uuid(),
});

export const selectItem = z.object({
  isSelected: z.boolean(),
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
  cardExpiration: z.string().min(5).max(7),
  cvv: z.string().min(3).max(4),
  couponCode: z.string().min(5).optional(),
});

export const cardDetailsSchema = z.object({
  cardNumber: z.string().min(16).max(16),
  cardExpiration: z.string().min(5).max(7),
  cvv: z.string().min(3).max(4),
});
