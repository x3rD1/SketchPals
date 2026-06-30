import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthUser } from "./auth.type";
import { prisma } from "../../lib/prisma";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const access = process.env.JWT_ACCESS_TOKEN;

  if (!access) {
    console.error("JWT_ACCESS_TOKEN missing");
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    const payload = jwt.verify(token, access) as AuthUser;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = user;

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
