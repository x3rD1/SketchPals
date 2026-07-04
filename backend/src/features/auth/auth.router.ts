import { Router, Request, Response } from "express";
import { client } from "../../config/google";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/appError";
import { AuthUser, GoogleUser } from "./auth.type";
import { requireAuth } from "./requireAuth";

const router = Router();

router.get("/me", requireAuth, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

router.post("/google", async (req, res) => {
  const { idToken } = req.body;

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) throw new AppError("Invalid Google token", 401);

  const { email, name, sub, picture } = payload as GoogleUser;

  // find or create user
  let user = await prisma.user.findUnique({ where: { googleId: sub } });

  if (!user) {
    user = await prisma.user.create({
      data: { email, username: name, googleId: sub },
    });
  }

  // create JWT accessToken
  const accessSecret = process.env.JWT_ACCESS_TOKEN;
  // create JWT refreshToken
  const refreshSecret = process.env.JWT_REFRESH_TOKEN;

  if (!accessSecret)
    throw new Error("JWT_ACCESS_TOKEN is missing in environment variables");
  if (!refreshSecret)
    throw new Error("JWT_REFRESH_TOKEN is missing in environment variables");

  const accessToken = jwt.sign({ userId: user.id }, accessSecret, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId: user.id }, refreshSecret, {
    expiresIn: "7d",
  });

  // set cookie for accessToken
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000,
  });
  // set cookie for refreshToken
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true });
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(401).json({ error: "No token" });

  const refresh = process.env.JWT_REFRESH_TOKEN;

  if (!refresh) throw new Error("No refresh token");

  try {
    const payload = jwt.verify(refreshToken, refresh) as AuthUser;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) res.sendStatus(401);

    const access = process.env.JWT_ACCESS_TOKEN;
    if (!access) throw new Error("No access token");

    const newAccessToken = jwt.sign({ userId: user?.id }, access, {
      expiresIn: "15m",
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000,
    });

    return res.sendStatus(200);
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/logout", requireAuth, async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({ message: "Logged out" });
});

export default router;
