import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { orderSchema } from "@/schema/order.schema";
import { processPayment } from "@/lib/performPayment";
import { removeCartItems } from "@/lib/cart";
import prisma from "@/lib/prisma";
import { JWTExpired } from "jose/errors";

export const POST = async (request: NextRequest) => {
  const session = await verifySession();
  try {
    const data = await request.json();
    const order = orderSchema.safeParse(data);

    if (!order.success) {
      return new Response(JSON.stringify({ error: "Invalid order data" }), {
        status: 400,
      });
    }

    // create order with status payment pending;
    const createdOrder = await prisma.order.create({
      data: {
        userId: session?.user.id,
        status: "pending",
        totalAmount: order.data?.totalAmount,
        orderItems: {
          createMany: {
            data: order.data?.items.map((item) => ({
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
      amount: order.data.totalAmount,
      cardNumber: order.data.cardNumber,
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

    if (order.data.couponCode) {
      await prisma.user.update({
        where: {
          id: session?.user.id,
        },
        data: {
          discountUnlockedAt: createdOrder.id,
          completedOrderCount: {
            increment: 1,
          },
        },
      });
    }

    await removeCartItems(order.data.items);
    return new Response(
      JSON.stringify({ message: "Order created successfully" }),
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    if (error instanceof JWTExpired) {
      return NextResponse.redirect("/signin");
    } else {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};
