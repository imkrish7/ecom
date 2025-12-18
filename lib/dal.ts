import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "./authSecretUtil";
import { UnauthorizedError } from "./errors";

export const verifySession = async (role: string[] = ["user"]) => {
  try {
    const session = (await cookies()).get("session")?.value;
    if (!session) return redirect("/login");
    const authentication = await verifyJWT(session);
    if (role && !role.includes(authentication.role)) {
      throw new UnauthorizedError("Unauthorized", 401, "UNAUTHORIZED");
    }
    return { isAuth: true, user: authentication };
  } catch (error) {
    throw error;
  }
};
