import { verifySession } from "@/lib/dal";
import { cartSchema } from "@/schema/order.schema";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { JWTExpired } from "jose/errors";

export const POST = async (request: NextRequest) => {
  const session = await verifySession();

  const data = await request.json();

  try {
    const validatedData = cartSchema.safeParse(data);

    if (!validatedData.success) {
      return new Response("Invalid Cart Data", { status: 400 });
    }

    // fetch user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      return new Response("Cart not found", { status: 404 });
    }

    // check if item exist in cart;
    const itemExist = cart.cartItems.some(
      (item) => item.productId === validatedData.data.items.productId,
    );

    if (itemExist) {
      return new Response(
        JSON.stringify({ message: "Item already exist in cart" }),
        { status: 400 },
      );
    }

    // update cart
    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        cartItems: {
          create: {
            productId: validatedData.data.items.productId,
            quantity: validatedData.data.items.quantity,
          },
        },
      },
      include: {
        cartItems: true,
      },
    });

    return new Response(JSON.stringify(updatedCart), { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof JWTExpired) {
      return NextResponse.redirect("/signin");
    } else {
      return new Response("Internal Server Error", { status: 500 });
    }
  }
};

export const GET = async () => {
  const session = await verifySession();
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        _count: {
          select: {
            cartItems: true,
          },
        },
      },
    });

    if (!cart) {
      return new Response(JSON.stringify({ message: "Cart not found" }), {
        status: 404,
      });
    }

    if (!cart._count.cartItems) {
      return new Response(JSON.stringify({ message: "Cart is empty" }), {
        status: 400,
      });
    }

    const fetchProduct = await prisma.$queryRaw`
      SELECT p.id, p.name, p.price, p.imageUrl, p.description, p.createdAt, p.updatedAt, ci.quantity, ci.id as cartItemId, ci.selected
      FROM Product p
      JOIN CartItem ci ON p.id = ci.productId
      WHERE ci.cartId = ${cart.id};
    `;

    return new Response(JSON.stringify({ products: fetchProduct }), {
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
