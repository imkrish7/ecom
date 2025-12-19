import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "./lib/authSecretUtil";
import { JWTExpired } from "jose/errors";
import { deleteSession } from "./lib/deleteSession";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/signin", "/signup", "/"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtected = protectedRoutes.includes(path);
  const isPublic = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;

  if (!cookie && isPublic) {
    return NextResponse.next();
  }
  if (!cookie) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  try {
    const session = await verifyJWT(cookie);

    if (isProtected && !session.id) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (
      isPublic &&
      session.id &&
      !req.nextUrl.pathname.startsWith("/dashboard") &&
      session.role === "user"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (
      isPublic &&
      session.id &&
      !req.nextUrl.pathname.startsWith("/admin") &&
      session.role === "admin"
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (error instanceof JWTExpired) {
      await deleteSession();
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
