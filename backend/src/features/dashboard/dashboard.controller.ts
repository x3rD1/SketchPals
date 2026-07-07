import { Params } from "../canvas/canvas.types";
import * as dashboardService from "./dashboard.service";
import { Request, Response, NextFunction } from "express";

export const getAllCanvases = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;

    const canvases = await dashboardService.getAllCanvases(userId);

    res.json(canvases);
  } catch (error) {
    next(error);
  }
};

export const updateCanvasTitle = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = {
      id: req.params.id,
      title: req.body.title,
      userId: req.user.id,
    };
    const canvas = await dashboardService.updateCanvasTitle(data);

    res.json(canvas);
  } catch (error) {
    next(error);
  }
};

export const getAllSharedCanvases = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;

    const canvases = await dashboardService.getAllSharedCanvases(userId);

    res.json(canvases);
  } catch (error) {
    next(error);
  }
};
