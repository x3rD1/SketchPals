import { Request, Response, NextFunction } from "express";
import authenticate from "./authenticate";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.accessToken;
  try {
    const user = await authenticate(token);

    req.user = user;

    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
