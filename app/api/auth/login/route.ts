import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { comparePassword } from "@/lib/passwordUtils";
import { createJWT } from "@/lib/authSecretUtil";
import loginSchema from "@/schema/login.schema";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const cookieStore = await cookies();

  try {
    const validateData = loginSchema.safeParse(data);

    if (!validateData.success) {
      return new Response("Invalid input", { status: 400 });
    }

    const { email, password } = validateData.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await comparePassword(password, user.password))) {
      return new Response("Invalid email or password", { status: 401 });
    }

    const token = await createJWT({ id: user.id, email, role: user.role });

    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return new Response(JSON.stringify({ token }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
