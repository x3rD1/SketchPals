import type { PenDeps, EraserDeps, Point, PanDeps, SelectDeps } from "./types";
import { didMove, getSelectionBounds, getStrokesInsideBox } from "./utils";

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
  setSelectedStrokeIndexes,
  findStrokeIndex,
  state,
  setState,
  initialStateRef,
  setCursorStyle,
  startPointRef,
  endPointRef,
  isSelectingBox,
  redraw,
}: SelectDeps) => ({
  onMouseDown(point: Point) {
    const index = findStrokeIndex(point);
    selectedIndexRef.current = index;

    if (selectedIndexRef.current !== null) {
      isSelectingBox.current = false;
      isDragging.current = true;
      dragStart.current = point;
      initialStateRef.current = state.history[state.index];
      setSelectedStrokeIndexes(new Set([selectedIndexRef.current]));
    } else {
      isDragging.current = false;
      dragStart.current = null;
      isSelectingBox.current = true;
      startPointRef.current = point;
      setCursorStyle("pointer");
      setSelectedStrokeIndexes(new Set());
    }
  },
  onMouseMove(point: Point) {
    const index = findStrokeIndex(point);

    if (!isDragging.current) {
      setHoveredIndex(index); // Highlight a stroke if dragging is false
    }

    if (isSelectingBox.current) {
      endPointRef.current = point;
      redraw();
    }

    if (!isDragging.current || dragStart.current === null) return;

    setCursorStyle("grabbing");

    // Calculate distance between dragStart and mouse position in world coords
    const dx = point.x - dragStart.current.x;
    const dy = point.y - dragStart.current.y;

    // Preview
    // Update latest state by moving each state's stroke's points by dx,dy as preview
    setState((prev) => {
      const currentIndex = prev.index;
      const history = [...prev.history]; // Create a shallow copy of prev.history

      const base = initialStateRef.current; // Use the stable original state
      if (base === null) return prev;

      const updatedState = base.map((stroke, i) => {
        if (i !== selectedIndexRef.current) return stroke; // Keep untouched stroke unmoved

        // Move selected stroke by dx,dy
        return {
          ...stroke,
          points: stroke.points.map((p) => ({
            x: p.x + dx,
            y: p.y + dy,
          })),
        };
      });

      history[currentIndex] = updatedState; // Mutate the history's current state

      return {
        history,
        index: currentIndex,
      };
    });
  },
  onMouseUp(point: Point) {
    if (isSelectingBox.current) {
      if (startPointRef.current === null || endPointRef.current === null) {
        startPointRef.current = null;
        endPointRef.current = null;
        isSelectingBox.current = false;
        return;
      }

      const start = startPointRef.current;
      const end = endPointRef.current;

      const dx = end.x - start.x;
      const dy = end.y - start.y;

      const threshold = 5;

      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
        startPointRef.current = null;
        endPointRef.current = null;
        isSelectingBox.current = false;
        redraw();
        return;
      }

      const bounds = getSelectionBounds(start, end);
      const strokes = state.history[state.index];
      const selected = getStrokesInsideBox(strokes, bounds);

      setSelectedStrokeIndexes(selected);

      startPointRef.current = null;
      endPointRef.current = null;
      isSelectingBox.current = false;
      redraw();
    }

    if (!isDragging.current) return;

    setCursorStyle("grab");

    setState((prev) => {
      const currentIndex = prev.index;
      const newHistory = prev.history.slice(0, currentIndex + 1); // Create new array from prev.index up until currentIndex

      const originalState = initialStateRef.current;
      if (originalState === null) return prev;

      const finalState = newHistory[currentIndex]; // current preview

      if (!didMove(originalState, finalState, selectedIndexRef)) return prev;

      // restore original
      newHistory[currentIndex] = originalState;

      // push final
      newHistory.push(finalState);

      return {
        history: newHistory,
        index: currentIndex + 1,
      };
    });

    isDragging.current = false;
    dragStart.current = null;
    isSelectingBox.current = false;
  },
});
