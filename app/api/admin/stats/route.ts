import { verifySession } from "@/lib/dal";
import { NextResponse } from "next/server";
import { JWTExpired } from "jose/errors";
import prisma from "@/lib/prisma";
import { UnauthorizedError } from "@/lib/errors";

export const GET = async () => {
  try {
    await verifySession(["admin"]);

    const purchaseAmount = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
    });

    const itemsCount = await prisma.orderItem.aggregate({
      _sum: {
        quantity: true,
      },
    });

    const discounts = await prisma.$queryRaw`
      SELECT SUM(o.discountAmount) as discountAmount, c.code, c.discount
      FROM "Order" o
      JOIN Coupon c ON o.couponCode = c.code
      GROUP BY c.code
    `;

    return new Response(
      JSON.stringify({
        purchaseAmount: purchaseAmount._sum.totalAmount,
        discounts: discounts,
        itemsPurchased: itemsCount._sum.quantity,
      }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    if (error instanceof JWTExpired) {
      return NextResponse.redirect("/signin");
    } else if (error instanceof UnauthorizedError) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: error.statusCode,
      });
    } else {
      return new Response(
        JSON.stringify({ message: "Internal Server Error" }),
        { status: 500 },
      );
    }
  }
};
