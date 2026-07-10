import { prisma } from "../../lib/prisma";
import { AuthUser } from "./auth.type";
import jwt from "jsonwebtoken";

async function authenticate(token: string | undefined) {
  if (!token) throw new Error("No accessToken");

  const access = process.env.JWT_ACCESS_TOKEN;

  if (!access) throw new Error("JWT_ACCESS_TOKEN missing");

  const payload = jwt.verify(token, access) as AuthUser;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) throw new Error("Unauthorized");

  return user;
}
export default authenticate;
