import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { Product } from "@/types/products";
import { JWTExpired } from "jose/errors";
import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/errors";

export const GET = async () => {
  const session = await verifySession();

  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    const products: Product[] = await prisma.$queryRaw`
      SELECT p.id, p.name, p.price, p.imageUrl, p.description, p.createdAt, p.updatedAt, ci.quantity, ci.id as cartItemId, ci.selected
      FROM Product p
      JOIN CartItem ci ON p.id = ci.productId
      WHERE ci.cartId = ${cart?.id} AND ci.selected = 1;
    `;
    const total = products.reduce((acc, item) => {
      if (!item) return acc;
      return acc + item.price * item.quantity!;
    }, 0);
    return new Response(JSON.stringify({ total, products }), {
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
