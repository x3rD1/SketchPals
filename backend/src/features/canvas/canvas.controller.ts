import { Request, Response, NextFunction } from "express";
import * as canvasService from "./canvas.service";
import { Params } from "./canvas.types";
import { AppError } from "../../errors/appError";

export const getCanvasById = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) throw new AppError("Invalid or Missing id", 400);

    const canvas = await canvasService.getCanvasById(id, userId);

    res.json(canvas);
  } catch (error) {
    next(error);
  }
};

export const createCanvas = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;

    const canvas = await canvasService.createCanvas(userId);

    res.status(201).json(canvas);
  } catch (error) {
    next(error);
  }
};

export const getCanvasMembers = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const canvasId = req.params.id;

    if (!canvasId) throw new AppError("Missing canvas ID", 400);

    const members = await canvasService.getCanvasMembers(canvasId);

    res.json(members);
  } catch (error) {
    next(error);
  }
};

export const addCanvasMember = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = {
      canvasId: req.params.id,
      memberId: req.body.memberId,
      ownerId: req.user.id,
    };

    const member = await canvasService.addCanvasMember(data);

    res.json(member);
  } catch (error) {
    next(error);
  }
};

export const removeCanvasMember = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = {
      canvasId: req.params.id,
      memberId: req.params.userId,
      ownerId: req.user.id,
    };

    await canvasService.removeCanvasMember(data);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
