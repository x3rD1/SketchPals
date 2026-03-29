import type { CanvasState, State } from "./types";

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

export const deleteSelectedStroke = (
  setState: React.Dispatch<React.SetStateAction<State>>,
  selectedIndex: number | null,
) => {
  setState((prev) => {
    const currentIndex = prev.index;
    const newHistory = prev.history.slice(0, currentIndex + 1);
    const currentState = newHistory[currentIndex];

    const updatedState = currentState.filter((_, i) => i !== selectedIndex);

    newHistory.push(updatedState);

    return {
      history: newHistory,
      index: prev.index + 1,
    };
  });
};
