import type { CanvasState, State, Point } from "./types";

export const didMove = (
  originalState: CanvasState,
  finalState: CanvasState,
  selectedIndicesRef: React.RefObject<Set<number>>,
): boolean => {
  const originalStrokePoints = originalState.find((_, i) =>
    selectedIndicesRef.current.has(i),
  )?.points;
  const finalStrokePoints = finalState.find((_, i) =>
    selectedIndicesRef.current.has(i),
  )?.points;

  if (originalStrokePoints === undefined || finalStrokePoints === undefined)
    return false;

  return originalStrokePoints.some((point, i) => {
    const otherPoint = finalStrokePoints[i];
    return point.x !== otherPoint.x || point.y !== otherPoint.y;
  });
};

export const deleteSelectedStroke = (
  setState: React.Dispatch<React.SetStateAction<State>>,
  selectedIndices: Set<number>,
) => {
  setState((prev) => {
    const currentIndex = prev.index;
    const newHistory = prev.history.slice(0, currentIndex + 1);
    const currentState = newHistory[currentIndex];

    const updatedState = currentState.filter((_, i) => !selectedIndices.has(i));

    newHistory.push(updatedState);

    return {
      history: newHistory,
      index: prev.index + 1,
    };
  });
};

export const getSelectionBounds = (start: Point, end: Point) => {
  const left = Math.min(start.x, end.x);
  const right = Math.max(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const bottom = Math.max(start.y, end.y);
  const width = right - left;
  const height = bottom - top;

  return { left, right, top, bottom, width, height };
};

export const getStrokesInsideBox = (
  strokes: CanvasState,
  bounds: { left: number; right: number; top: number; bottom: number },
) => {
  const { left, right, top, bottom } = bounds;

  const selected = new Set<number>();

  strokes.forEach((stroke, i) => {
    const points = stroke.points;

    const isInside = points.some(
      (point) =>
        point.x >= left &&
        point.x <= right &&
        point.y >= top &&
        point.y <= bottom,
    );

    if (isInside) {
      selected.add(i);
    }
  });

  return selected;
};

export const didMoveEnough = (start: Point, end: Point) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  const threshold = 5;

  return Math.abs(dx) > threshold || Math.abs(dy) > threshold;
};
