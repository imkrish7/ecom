import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { couponSchema } from "@/schema/coupon.schema";
import { JWTExpired } from "jose/errors";
import { UnauthorizedError } from "@/lib/errors";

export const POST = async (req: NextRequest) => {
  try {
    await verifySession(["admin"]);

    const data = await req.json();
    const validatedData = couponSchema.safeParse(data);

    if (!validatedData.success) {
      return new Response(JSON.stringify({ error: "Invalid data" }), {
        status: 400,
      });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: validatedData.data.code,
        discount: validatedData.data.discount,
        orderRequirements: validatedData.data.orderRequirements,
      },
    });

    return new Response(JSON.stringify(coupon), {
      status: 201,
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
