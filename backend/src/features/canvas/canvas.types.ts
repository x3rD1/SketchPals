import { Stroke } from "../../../generated/prisma/client";

export type Point = {
  x: number;
  y: number;
};

export type StrokeInput = {
  id: string;
  points: Point[];
  width: number;
  color: string;
};

export type CanvasState = Stroke[];

export type Params = {
  id: string;
};
