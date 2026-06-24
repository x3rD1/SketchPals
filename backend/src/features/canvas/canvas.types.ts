import { Stroke } from "../../../generated/prisma/client";

export type StrokeInput = {
  id: string;
  points: number[];
  width: number;
  color: string;
};

export type CanvasState = Stroke[];

export type Params = {
  id: string;
};

type AddOp = {
  type: "add";
  strokes: StrokeInput[];
};

type MoveOp = {
  type: "move";
  strokes: StrokeInput[];
};

type DeleteOp = {
  type: "delete";
  ids: string[];
};

export type CanvasOp = AddOp | MoveOp | DeleteOp;
