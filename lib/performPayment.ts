"use server";

import { Payment } from "@/types/orders";
import prisma from "./prisma";
import { v4 as uuid } from "uuid";

export const processPayment = async (order: Payment) => {
  // Perform payment processing logic here

  try {
    const checkPaymentOfOrderExists = await prisma.payment.findUnique({
      where: {
        orderId: order.orderId,
      },
    });

    if (checkPaymentOfOrderExists) {
      throw new Error("Payment already exists");
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: order.orderId,
        amount: order.amount,
        cardNumber: order.cardNumber,
        intent: `card-${uuid()}`,
        status: "DONE",
      },
    });

    return payment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
