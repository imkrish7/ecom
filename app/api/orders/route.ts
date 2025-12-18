import prisma from "@/lib/prisma";
import { JWTExpired } from "jose/errors";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";

export const GET = async () => {
  try {
    const session = await verifySession();
    const orderItems = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: true,
      },
    });

    const orderProducts = await prisma.product.findMany({
      where: {
        id: {
          in: orderItems.flatMap((item) =>
            item.orderItems.map((orderItem) => orderItem.productId),
          ),
        },
      },
    });

    return new Response(JSON.stringify({ orderItems, orderProducts }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof JWTExpired) {
      return NextResponse.redirect("/signin");
    } else {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};
