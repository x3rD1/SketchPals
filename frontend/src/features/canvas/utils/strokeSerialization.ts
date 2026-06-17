import type { CanvasState, Point, SerializedStroke } from "../types/types";

const PRECISION = 100;

const serializePoints = (points: Point[]) => {
  const result: number[] = [];

  for (const point of points) {
    result.push(
      Math.round(point.x * PRECISION),
      Math.round(point.y * PRECISION),
    );
  }
  return result;
};

export const serializeStrokes = (strokes: CanvasState) => {
  const result: SerializedStroke[] = [];

  for (const stroke of strokes) {
    result.push({ ...stroke, points: serializePoints(stroke.points) });
  }

  return result;
};

const deserializePoints = (points: number[]): Point[] => {
  const result: Point[] = [];

  for (let i = 0; i < points.length; i += 2) {
    result.push({
      x: points[i] / PRECISION,
      y: points[i + 1] / PRECISION,
    });
  }

  return result;
};

export const deserializeStrokes = (strokes: SerializedStroke[]) => {
  const result: CanvasState = [];

  for (const stroke of strokes) {
    result.push({ ...stroke, points: deserializePoints(stroke.points) });
  }

  return result;
};
