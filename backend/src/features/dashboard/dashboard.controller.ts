import * as dashboardService from "./dashboard.service";
import { Request, Response, NextFunction } from "express";

export const getAllCanvases = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const canvases = await dashboardService.getAllCanvases();

    res.json(canvases);
  } catch (error) {
    next(error);
  }
};
