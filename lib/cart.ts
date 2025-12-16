"use server";

import prisma from "./prisma";
import { CartItem } from "../types/orders";

export const removeCartItems = async (cartItems: CartItem[]) => {
  await prisma.cartItem.deleteMany({
    where: {
      id: {
        in: cartItems.map((item) => item.productId),
      },
    },
  });
};
