import { UnauthorizedError } from "@/lib/errors";
import { NextResponse } from "next/server";
import { JWTExpired } from "jose/errors";
import { verifySession } from "@/lib/dal";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await verifySession(["user", "admin"]);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }
    return new Response(
      JSON.stringify({ name: user.name, role: user.role, email: user.email }),
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
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
}
