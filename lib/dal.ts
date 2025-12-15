import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJWT } from "./authSecretUtil";

export const verifySession = async () => {
  const session = (await cookies()).get("session")?.value;
  if (!session) return redirect("/login");
  const authentication = await verifyJWT(session);

  if (!authentication.id) {
    redirect("/login");
  }

  return { isAuth: true, user: authentication };
};
