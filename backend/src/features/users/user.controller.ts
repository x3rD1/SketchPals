import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import { AppError } from "../../errors/appError";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUser = req.user.id;

    const input =
      typeof req.query.query === "string" ? req.query.query : undefined;

    if (!input) throw new AppError("Missing input", 403);

    const canvasId =
      typeof req.query.canvasId === "string" ? req.query.canvasId : undefined;

    if (!canvasId) throw new AppError("Missing canvasId", 403);

    const user = await userService.getUsers({ input, currentUser, canvasId });

    res.json(user);
  } catch (error) {
    next(error);
  }
};
