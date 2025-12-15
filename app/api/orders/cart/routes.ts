import { verifySession } from "@/lib/dal";
import { cartSchema } from "@/schema/order.schema";
import prisma from "@/lib/prisma";

export const POST = async (request: Request) => {
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
      return new Response("Item already exist in cart", { status: 400 });
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
    return new Response("Internal Server Error", { status: 500 });
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
      return new Response("Cart not found", { status: 404 });
    }

    if (!cart._count.cartItems) {
      return new Response("Cart is empty", { status: 400 });
    }

    const fetchProduct = await prisma.$queryRaw`
      SELECT p.id, p.name, p.price,
      FROM products p
      JOIN cartItem ci ON p.id = ci.product_id
      WHERE ci.cart_id = ${cart.id};
    `;

    console.log(fetchProduct);

    return new Response(JSON.stringify(cart), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
