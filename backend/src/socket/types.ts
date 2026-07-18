import { CanvasOp } from "../features/canvas/canvas.types";

export type SerializedStroke = {
  id: string;
  points: number[];
  color: string;
  width: number;
};

export type CanvasEventVars = { canvasId: string; op: CanvasOp };

export type SaveCanvasVars = {
  canvasId: string;
  image: ArrayBuffer;
  version: number;
};
