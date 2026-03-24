import type { PenDeps, EraserDeps, Point, PanDeps } from "./types";

export const penTool = ({
  redraw,
  setState,
  isDrawing,
  currentStroke,
  color,
  width,
}: PenDeps) => ({
  onMouseDown(point: Point) {
    isDrawing.current = true;

    currentStroke.current = {
      points: [point],
      color,
      width,
    };
  },
  onMouseMove(point: Point) {
    if (!isDrawing.current) return;

    currentStroke.current?.points.push(point);

    redraw();
  },
  onMouseUp() {
    const stroke = currentStroke.current;
    if (!stroke) return;

    setState((prev) => {
      // Index of the current state in history
      const currentIndex = prev.index;

      // Take all the states in history up until the currentIndex
      const newHistory = prev.history.slice(0, currentIndex + 1);

      // Create a new state by copying the latest state and adding the current stroke
      const newState = [...newHistory[newHistory.length - 1], stroke];

      // Add the new state to the history
      newHistory.push(newState);

      return {
        history: newHistory, // Mutate the previous history with the new one
        index: currentIndex + 1, // Point the index to the recently added state
      };
    });

    currentStroke.current = null; // Resets the current stroke so the future point will not connect to the previous point
    isDrawing.current = false;
  },
});

export const eraserTool = ({
  findStrokeIndex,
  setHoveredIndex,
  handleErase,
}: EraserDeps) => ({
  onMouseDown(point: Point) {
    setHoveredIndex(null);
    handleErase(point);
  },
  onMouseMove(point: Point, { isDrawing }: { isDrawing: boolean }) {
    const indexToHover = findStrokeIndex(point);
    setHoveredIndex(indexToHover);

    if (isDrawing) {
      setHoveredIndex(null);
      handleErase(point);
    }
  },
  onMouseUp() {},
});

export const panTool = ({
  isPanning,
  viewport,
  setViewport,
  initialMousePosition,
}: PanDeps) => ({
  onMouseDown(point: Point) {
    isPanning.current = true;

    initialMousePosition.current = point;
  },
  onMouseMove(point: Point) {
    if (!isPanning.current || !initialMousePosition.current) return;

    const dx = (point.x - initialMousePosition.current.x) * viewport.scale;
    const dy = (point.y - initialMousePosition.current.y) * viewport.scale;

    setViewport((prev) => ({
      ...prev,
      offsetX: prev.offsetX + dx,
      offsetY: prev.offsetY + dy,
    }));
  },
  onMouseUp() {
    isPanning.current = false;
  },
});
