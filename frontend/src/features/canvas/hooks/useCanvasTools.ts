import { useRef, useState } from "react";
import type { Point, CanvasState, Tool, CanvasEngine } from "../types/types";
import { eraserTool, panTool, penTool, selectTool } from "../tools/tools";
import { getMousePos } from "../utils/coordinates";
import { findStrokeId } from "../utils/hitDetection";

export default function useCanvasTools(engine: CanvasEngine) {
  const { canvas2D, history, stroke, viewport, renderer } = engine;

  const [tool, setTool] = useState<Tool>("Pen");

  const [cursorStyle, setCursorStyle] = useState("crosshair");

  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isDragging = useRef(false);
  const isSelectingBox = useRef(false);

  const prevPoint = useRef(null);

  const dragStart = useRef<Point | null>(null);
  const initialStateRef = useRef<CanvasState | null>(null);

  const initialMousePosition = useRef<Point>(null);

  const tools = {
    Pen: penTool({
      redraw: renderer.redraw,
      setState: history.setState,
      isDrawing,
      currentStroke: stroke.currentStroke,
      color: stroke.color,
      width: stroke.width,
      prevPoint,
    }),
    Eraser: eraserTool({
      strokes: history.strokes,
      findStrokeId,
      setHoveredId: renderer.setHoveredId,
      handleErase: history.handleErase,
    }),
    Pan: panTool({
      isPanning,
      viewport: viewport.viewport,
      setViewport: viewport.setViewport,
      initialMousePosition,
    }),
    Select: selectTool({
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

    const point = getMousePos(e, canvas2D.canvasRef, viewport.viewport);
    if (!point) return;

    // Run the logic depending on the tool selected
    tools[tool].onMouseDown(point);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const point = getMousePos(e, canvas2D.canvasRef, viewport.viewport);
    if (!point) return;

    // Run the logic depending on the tool selected
    tools[tool].onMouseMove(point, { isDrawing: e.buttons === 1 });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const point = getMousePos(e, canvas2D.canvasRef, viewport.viewport);
    if (!point) return;

    tools[tool].onMouseUp(point);
  };

  const handleMouseLeave = () => {
    isDrawing.current = false;
  };

  const selectionTool = (newTool: Tool) => {
    // Update tool state upon selection
    setTool(newTool);

    // Unselect stroke/s upon selection
    if (newTool !== "Select") renderer.setSelectedIds(new Set());

    switch (newTool) {
      case "Pen":
        setCursorStyle("crosshair");
        break;

      case "Eraser":
        setCursorStyle("cell");
        break;

      case "Pan":
        setCursorStyle("grab");
        break;

      case "Select":
        setCursorStyle("pointer");
        break;

      default:
        setCursorStyle("crosshair");
        break;
    }
  };

  return {
    currentTool: tool,

    cursorStyle,

    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,

    selectionTool,
  };
}
