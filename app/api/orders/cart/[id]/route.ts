import { deleteCartSchema, selectItem } from "@/schema/order.schema";
import { verifySession } from "@/lib/dal";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export const POST = async (
  request: NextRequest,
  params: { params: Promise<{ id: string }> },
) => {
  try {
    const data = await params.params;

    const requestData = await request.json();

    const validatedData = selectItem.safeParse(requestData);

    if (!validatedData.success) {
      return new Response(JSON.stringify({ message: "Invalid request" }), {
        status: 400,
      });
    }
    console.log(data.id);
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        productId: data.id,
      },
    });

    if (!cartItem) {
      return new Response(JSON.stringify({ message: "Cart item not found" }), {
        status: 404,
      });
    }

    await prisma.cartItem.update({
      where: {
        productId: data.id,
      },
      data: {
        selected: validatedData.data.isSelected,
      },
    });

    return new Response(JSON.stringify({ message: "Item Selected" }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const DELETE = async (
  _request: NextRequest,
  params: { params: Promise<{ id: string }> },
) => {
  const session = await verifySession();
  try {
    const data = await params.params;
    const validatedData = deleteCartSchema.safeParse(data);

    if (!validatedData.success) {
      return new Response(JSON.stringify({ message: "Invalid data" }), {
        status: 400,
      });
    }
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      return new Response("Cart not found", { status: 404 });
    }

    await prisma.cartItem.delete({
      where: {
        cartId: cart.id,
        id: validatedData.data.id,
      },
    });

    return new Response(
      JSON.stringify({ message: "Cart item deleted successfully" }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
