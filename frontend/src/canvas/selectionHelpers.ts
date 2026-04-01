import type { Point } from "./types";

export const resetSelectionBox = ({
  startPointRef,
  endPointRef,
  isSelectingBox,
}: {
  startPointRef: React.RefObject<Point | null>;
  endPointRef: React.RefObject<Point | null>;
  isSelectingBox: React.RefObject<boolean>;
}) => {
  ((startPointRef.current = null),
    (endPointRef.current = null),
    (isSelectingBox.current = false));
};
