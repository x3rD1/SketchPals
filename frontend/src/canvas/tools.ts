import type { PenDeps, EraserDeps, Point, PanDeps, SelectDeps } from "./types";

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

export const selectTool = ({
  isDragging,
  dragStart,
  selectedIndexRef,
  setHoveredIndex,
  setSelectedStrokeIndex,
  findStrokeIndex,
  setState,
}: SelectDeps) => ({
  onMouseDown(point: Point) {
    const index = findStrokeIndex(point);
    selectedIndexRef.current = index;

    setSelectedStrokeIndex(index);

    if (selectedIndexRef.current !== null) {
      isDragging.current = true;
      dragStart.current = point;
    }
  },
  onMouseMove(point: Point) {
    const index = findStrokeIndex(point);

    if (!isDragging.current) {
      setHoveredIndex(index);
    }

    if (!isDragging.current || dragStart.current === null) return;

    const dx = point.x - dragStart.current.x;
    const dy = point.y - dragStart.current.y;

    dragStart.current = point;

    setState((prev) => {
      const currentIndex = prev.index;
      const newHistory = prev.history.slice(0, currentIndex + 1);

      const currentState = newHistory[newHistory.length - 1];

      const updatedState = currentState.map((stroke, i) => {
        if (i !== selectedIndexRef.current) return stroke;

        return {
          ...stroke,
          points: stroke.points.map((p) => ({
            x: p.x + dx,
            y: p.y + dy,
          })),
        };
      });

      newHistory[newHistory.length - 1] = updatedState;

      return {
        history: newHistory,
        index: currentIndex,
      };
    });
  },
  onMouseUp() {
    isDragging.current = false;
    dragStart.current = null;
  },
});
