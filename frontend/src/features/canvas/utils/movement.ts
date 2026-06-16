import type { Point, CanvasState } from "../types/types";

export const didMove = (
  originalState: CanvasState,
  finalState: CanvasState,
  selectedIdsRef: React.RefObject<Set<string>>,
): boolean => {
  const originalStrokePoints = originalState.find((stroke) =>
    selectedIdsRef.current.has(stroke.id),
  )?.points;
  const finalStrokePoints = finalState.find((stroke) =>
    selectedIdsRef.current.has(stroke.id),
  )?.points;

  if (originalStrokePoints === undefined || finalStrokePoints === undefined)
    return false;

  return originalStrokePoints.some((point, i) => {
    const otherPoint = finalStrokePoints[i];
    return point.x !== otherPoint.x || point.y !== otherPoint.y;
  });
};

export const didMoveEnough = (start: Point, end: Point) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const threshold = 5;

  return Math.abs(dx) > threshold || Math.abs(dy) > threshold;
};
