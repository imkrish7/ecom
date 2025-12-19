import { verifySession } from "@/lib/dal";
import { NextRequest, NextResponse } from "next/server";
import { JWTExpired } from "jose/errors";
import prisma from "@/lib/prisma";

export const GET = async (_req: NextRequest) => {
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
      SELECT SUM(o.discountAmount) as discountAmount, c.code
      FROM orders o JOIN coupon c
      ON o.couponCode = c.code
      GROUP BY c.code
    `;

    return new Response(
      JSON.stringify({
        purchaseAmount: purchaseAmount._sum.totalAmount,
        discount: discounts,
        itemsPurchased: itemsCount._sum.quantity,
      }),
      { status: 200 },
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
