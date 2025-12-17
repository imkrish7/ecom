import { NextResponse, NextRequest } from "next/server";
import { verifyJWT } from "./lib/authSecretUtil";

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
  const session = await verifyJWT(cookie);

  if (isProtected && !session.id) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (
    isPublic &&
    session.id &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
