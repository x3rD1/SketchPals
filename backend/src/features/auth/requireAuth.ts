import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/appError";
import { AuthUser } from "./auth.type";
import { prisma } from "../../lib/prisma";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ error: "No token" });

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is missing in environment variables", 500);
  }

  try {
    const payload = jwt.verify(token, secret) as AuthUser;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) throw new AppError("Invalid token", 401);

    req.user = user;

    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};
