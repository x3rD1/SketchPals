import type { CanvasState } from "./types";

export const didMove = (
  originalState: CanvasState,
  finalState: CanvasState,
  selectedIndexRef: React.RefObject<number | null>,
): boolean => {
  const originalStrokePoints = originalState.find(
    (_, i) => i === selectedIndexRef.current,
  )?.points;
  const finalStrokePoints = finalState.find(
    (_, i) => i === selectedIndexRef.current,
  )?.points;

  if (originalStrokePoints === undefined || finalStrokePoints === undefined)
    return false;

  return originalStrokePoints.some((point, i) => {
    const otherPoint = finalStrokePoints[i];
    return point.x !== otherPoint.x || point.y !== otherPoint.y;
  });
};
