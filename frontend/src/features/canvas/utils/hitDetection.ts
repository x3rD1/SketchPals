import type { Point, CanvasState } from "../types/types";

const HIT_TOLERANCE = 2;

const isPointNearSegment = (
  p1: Point,
  p2: Point,
  mouse: Point,
  radius: number,
) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const mx = mouse.x - p1.x;
  const my = mouse.y - p1.y;

  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return false;

  const t = (mx * dx + my * dy) / lengthSq;

  const clampedT = Math.max(0, Math.min(1, t));

  const closestX = p1.x + dx * clampedT;
  const closestY = p1.y + dy * clampedT;

  const distX = mouse.x - closestX;
  const distY = mouse.y - closestY;

  const distance = Math.sqrt(distX * distX + distY * distY);

  return distance < radius;
};

export const findStrokeId = (mouse: Point, strokes: CanvasState) => {
  if (!strokes) return null;
  // Loop over current strokes
  for (let i = strokes.length - 1; i >= 0; i--) {
    const stroke = strokes[i];
    const points = stroke.points;
    const radius = stroke.width / 2 + HIT_TOLERANCE;

    // Loop over points
    for (let j = 0; j < points.length - 1; j++) {
      const p1 = points[j];
      const p2 = points[j + 1];

      if (isPointNearSegment(p1, p2, mouse, radius)) {
        // return stroke's id
        return stroke.id;
      }
    }
  }
  return null;
};
