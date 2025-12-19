import prisma from "@/lib/prisma";
import { JWTExpired } from "jose/errors";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { UnauthorizedError } from "@/lib/errors";

export const GET = async () => {
  try {
    const session = await verifySession();
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    return new Response(JSON.stringify({ orders }), {
      status: 200,
    });
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
