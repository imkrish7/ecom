import { hashPassword } from "@/lib/passwordUtils";
import prisma from "@/lib/prisma";
import signupSchema from "@/schema/signup.schema";

export const POST = async (request: Request) => {
  const data = await request.json();

  try {
    const validatedData = signupSchema.safeParse(data);
    if (validatedData.error) {
      return new Response(JSON.stringify(validatedData.error), { status: 400 });
    }
    const { email, password, name } = validatedData.data;

    const isUserExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isUserExist) {
      return new Response("User already exists", { status: 409 });
    }
    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        discountUnlockedAt: "",
      },
    });
    return new Response("User created successfully", { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
