import type { Point, CanvasState } from "../types/types";

export const resetSelectionBox = ({
  startPointRef,
  endPointRef,
  isSelectingBox,
}: {
  startPointRef: React.RefObject<Point | null>;
  endPointRef: React.RefObject<Point | null>;
  isSelectingBox: React.RefObject<boolean>;
}) => {
  startPointRef.current = null;
  endPointRef.current = null;
  isSelectingBox.current = false;
};

export const getStrokesInsideBox = (
  strokes: CanvasState,
  bounds: { left: number; right: number; top: number; bottom: number },
) => {
  const { left, right, top, bottom } = bounds;

  const selected = new Set<string>();

  strokes.forEach((stroke) => {
    const points = stroke.points;

    const isInside = points.some(
      (point) =>
        point.x >= left &&
        point.x <= right &&
        point.y >= top &&
        point.y <= bottom,
    );

    if (isInside) {
      selected.add(stroke.id);
    }
  });

  return selected;
};
