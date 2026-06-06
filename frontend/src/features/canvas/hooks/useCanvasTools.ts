import { useRef, useState } from "react";
import type { Point, CanvasState, Tool } from "../types/types";
import { eraserTool, panTool, penTool, selectTool } from "../tools/tools";
import { getMousePos } from "../utils/coordinates";
import useCanvasEngine from "./useCanvasEngine";
import { findStrokeId } from "../utils/hitDetection";

type CanvasEngine = ReturnType<typeof useCanvasEngine>;

export default function useCanvasTools(engine: CanvasEngine) {
  const { canvasRef, history, stroke, viewport, renderer } = engine;

  const [tool, setTool] = useState<Tool>("pen");

  const [cursorStyle, setCursorStyle] = useState("crosshair");

  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isDragging = useRef(false);
  const isSelectingBox = useRef(false);

  const dragStart = useRef<Point | null>(null);
  const initialStateRef = useRef<CanvasState | null>(null);

  const initialMousePosition = useRef<Point>(null);

  const tools = {
    pen: penTool({
      redraw: renderer.redraw,
      setState: history.setState,
      isDrawing,
      currentStroke: stroke.currentStroke,
      color: stroke.color,
      width: stroke.width,
    }),
    eraser: eraserTool({
      strokes: history.strokes,
      findStrokeId,
      setHoveredId: renderer.setHoveredId,
      handleErase: history.handleErase,
    }),
    pan: panTool({
      isPanning,
      viewport: viewport.viewport,
      setViewport: viewport.setViewport,
      initialMousePosition,
    }),
    select: selectTool({
      strokes: history.strokes,
      isDragging,
      dragStart,
      selectedIdsRef: renderer.selectedIdsRef,
      setHoveredId: renderer.setHoveredId,
      setSelectedIds: renderer.setSelectedIds,
      findStrokeId,
      state: history.state,
      setState: history.setState,
      initialStateRef,
      setCursorStyle,
      startPointRef: renderer.startPointRef,
      endPointRef: renderer.endPointRef,
      isSelectingBox,
      redraw: renderer.redraw,
    }),
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    const point = getMousePos(e, canvasRef, viewport.viewport);
    if (!point) return;

    // Run the logic depending on the tool selected
    tools[tool].onMouseDown(point);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const point = getMousePos(e, canvasRef, viewport.viewport);
    if (!point) return;

    // Run the logic depending on the tool selected
    tools[tool].onMouseMove(point, { isDrawing: e.buttons === 1 });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const point = getMousePos(e, canvasRef, viewport.viewport);
    if (!point) return;

    tools[tool].onMouseUp(point);
  };

  const handleMouseLeave = () => {
    isDrawing.current = false;
  };

  const selectionTool = (newTool: Tool) => {
    setTool(newTool);

    switch (newTool) {
      case "pen":
        setCursorStyle("crosshair");
        break;

      case "eraser":
        setCursorStyle("cell");
        break;

      case "pan":
        setCursorStyle("grab");
        break;

      case "select":
        setCursorStyle("pointer");
        break;

      default:
        setCursorStyle("crosshair");
        break;
    }
  };

  return {
    cursorStyle,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    selectionTool,
  };
}
