"use server";

import prisma from "./prisma";
import { CartItem } from "../types/orders";

export const removeCartItems = async (cartItems: CartItem[]) => {
  console.log(cartItems);
  await prisma.cartItem.deleteMany({
    where: {
      productId: {
        in: cartItems.map((item) => item.productId),
      },
    },
  });
};
