import { Router, Request, Response } from "express";
import { client } from "../../config/google";
import { prisma } from "../../lib/prisma";
import jwt from "jsonwebtoken";
import { AppError } from "../../errors/appError";
import { GoogleUser } from "./auth.type";
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
      data: { email, name, googleId: sub },
    });
  }

  // create JWT
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in environment variables");
  }

  const token = jwt.sign({ userId: user.id }, secret, {
    expiresIn: "15m",
  });

  // set cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.json({ success: true });
});

export default router;
