import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "./authSecretUtil";
import { JWTExpired } from "jose/errors";

export const verifySession = async () => {
  try {
    const session = (await cookies()).get("session")?.value;
    if (!session) return redirect("/login");
    const authentication = await verifyJWT(session);
    return { isAuth: true, user: authentication };
  } catch (error) {
    if (error instanceof JWTExpired) {
      redirect("/signin");
    } else {
      throw error;
    }
  }
};
