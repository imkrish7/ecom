import { NextRequest } from "next/server";
import { verifySession } from "@/lib/dal";
import { orderSchema } from "@/schema/order.schema";
import { processPayment } from "@/lib/performPayment";
import { removeCartItems } from "@/lib/cart";
import prisma from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
  const session = await verifySession();
  try {
    const order = await orderSchema.parseAsync(request.json());
    // create order with status payment pending;
    const createdOrder = await prisma.order.create({
      data: {
        userId: session?.user.id,
        status: "pending",
        totalAmount: order.totalAmount,
        orderItems: {
          createMany: {
            data: order.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      },
    });
    // p
    const payment = await processPayment({
      orderId: createdOrder.id,
      amount: order.totalAmount,
      cardNumber: order.cardNumber,
    });

    await prisma.order.update({
      where: {
        id: createdOrder.id,
      },
      data: {
        status: payment.status,
        paymentId: payment.id,
      },
    });

    await removeCartItems(order.items);
    return new Response("Order created successfully", { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
