import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";

export const GET = async () => {
  const session = await verifySession();
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    let query = {};
    if (user?.discountUnlockedAt) {
      query = {
        take: 10,
        cursor: {
          id: user?.discountUnlockedAt ?? undefined,
        },
        where: {
          userId: user?.id,
          completed: true,
        },
      };
    } else {
      query = {
        take: 10,
        where: {
          userId: user?.id,
          completed: true,
        },
      };
    }
    const fetchOrders = await prisma.order.findMany(query);
    const coupons = await prisma.coupon.findMany({
      where: {
        orderRequirements: {
          gte: fetchOrders.length,
        },
      },
    });
    return new Response(JSON.stringify(coupons), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  await verifySession();
  try {
    const { code, total } = await request.json();

    const fetchCoupon = await prisma.coupon.findUnique({
      where: {
        code,
      },
    });

    if (!fetchCoupon) {
      return new Response(JSON.stringify({ error: "Invalid Coupon Code" }), {
        status: 400,
      });
    }

    const discountOnTotal = (fetchCoupon?.discount * total) / 100;
    const discountedTotal = total - discountOnTotal;

    return new Response(
      JSON.stringify({ discountOnTotal, discountedTotal, total }),
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
};
