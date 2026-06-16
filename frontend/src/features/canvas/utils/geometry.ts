import type { Point } from "../types/types";

export const getSelectionBounds = (start: Point, end: Point) => {
  const left = Math.min(start.x, end.x);
  const right = Math.max(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const bottom = Math.max(start.y, end.y);
  const width = right - left;
  const height = bottom - top;

  return { left, right, top, bottom, width, height };
};
