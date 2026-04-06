import { NextFunction, Request, Response } from "express";
import * as strokeService from "./stroke.service";

export const getAllStrokes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const strokes = await strokeService.getAllStrokes();
    res.json(strokes);
  } catch (error) {
    next(error);
  }
};

export const createStroke = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { points } = req.body;

    const stroke = await strokeService.createStroke(points);

    res.json(stroke);
  } catch (error) {
    next(error);
  }
};
