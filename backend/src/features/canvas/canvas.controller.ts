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
    if (!id) throw new AppError("Invalid or Missing id", 400);

    const canvas = await canvasService.getCanvasById(id);

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
    const canvas = await canvasService.createCanvas();

    res.status(201).json(canvas);
  } catch (error) {
    next(error);
  }
};

export const updateCanvas = async (
  req: Request<Params>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = {
      id: req.params.id,
      strokes: req.body.strokes,
    };

    const updated = await canvasService.updateCanvas(data);

    res.json(updated);
  } catch (error) {
    next(error);
  }
};
