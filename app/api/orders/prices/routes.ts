import { orderSchema } from "@/schema/order.schema";
import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  await verifySession();

  const data = await request.json();
  try {
    const validatedData = orderSchema.safeParse(data);
    if (!validatedData.success) {
      return new Response("Invalid order data", {
        status: 400,
      });
    }
    const { items } = validatedData.data;
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: items.map((item) => item.productId),
        },
      },
    });
    const total = items.reduce((acc, item) => {
      const product = products.find((product) => product.id === item.productId);
      if (!product) return acc;
      return acc + product.price * item.quantity;
    }, 0);
    return new Response(JSON.stringify({ total }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};
