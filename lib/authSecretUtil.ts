import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { AuthPayload } from "@/types/auth";

export const createJWT = async (payload: AuthPayload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  const token = new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(secret));
  return token;
};

export const verifyJWT = async (token: string | undefined) => {
  console.log(token);
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload as unknown as AuthPayload;
};
