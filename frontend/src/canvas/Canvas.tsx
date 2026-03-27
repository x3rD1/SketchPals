import React, { useEffect, useRef, useState } from "react";
import type {
  Tool,
  Point,
  Stroke,
  State,
  Viewport,
  CanvasState,
} from "./types";
import { penTool, eraserTool, panTool, selectTool } from "./tools";

const HIT_TOLERANCE = 2;

function Canvas() {
  const [state, setState] = useState<State>({ history: [[]], index: 0 });
  const initialStateRef = useRef<CanvasState | null>(null);
  const [viewport, setViewport] = useState<Viewport>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const [tool, setTool] = useState<Tool>("pen");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedStrokeIndex, setSelectedStrokeIndex] = useState<number | null>(
    null,
  );
  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(5);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const viewportRef = useRef(viewport);
  const currentStroke = useRef<Stroke | null>(null);
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isDragging = useRef(false);
  const dragStart = useRef<Point | null>(null);
  const selectedIndexRef = useRef<number | null>(null);
  const initialMousePosition = useRef<Point>(null);

  // Current canvas state
  const strokes = state.history[state.index] || [];

  const getMousePos = (
    e: { clientX: number; clientY: number },
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    // Get mouse coords on canvas
    const mouseCoordsOnCanvas = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // Convert canvas coords to world coords
    const worldCoords = {
      x: (mouseCoordsOnCanvas.x - viewport.offsetX) / viewport.scale,
      y: (mouseCoordsOnCanvas.y - viewport.offsetY) / viewport.scale,
    };

    return worldCoords;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getMousePos(e, canvas);
    // Run the logic depending on the tool selected
    tools[tool].onMouseDown(point);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getMousePos(e, canvas);

    // Run the logic depending on the tool selected
    tools[tool].onMouseMove(point, { isDrawing: e.buttons === 1 });
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Reset
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 500, 500);

    // Transform canvas
    ctx.setTransform(
      viewport.scale,
      0,
      0,
      viewport.scale,
      viewport.offsetX,
      viewport.offsetY,
    );

    // Render the stroke
    const allStrokes = [
      ...strokes,
      ...(currentStroke.current ? [currentStroke.current] : []),
    ];

    allStrokes.forEach((stroke, i) => {
      ctx.beginPath();

      // Update color on hover/select
      if (i === selectedStrokeIndex) {
        ctx.strokeStyle = "blue";
      } else if (i === hoveredIndex) {
        ctx.strokeStyle = "gray";
      } else {
        ctx.strokeStyle = stroke.color;
      }

      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = stroke.width;
      ctx.stroke();
    });
  };

  const handleUndo = () => {
    if (state.index === 0) return;

    setState((prev) => ({ ...prev, index: prev.index - 1 }));
  };

  const handleRedo = () => {
    if (state.history.length === state.index + 1) return;

    setState((prev) => ({ ...prev, index: prev.index + 1 }));
  };

  const handleErase = (point: Point) => {
    const mousePos = point;
    if (!mousePos) return;

    const indexToRemove = findStrokeIndex(mousePos);

    if (indexToRemove === -1) return;

    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.index + 1);
      const lastState = newHistory[newHistory.length - 1];

      if (!lastState) return prev;

      const newState = lastState.filter((_, i) => i !== indexToRemove);

      newHistory.push(newState);

      return {
        history: newHistory,
        index: prev.index + 1,
      };
    });
  };

  const isPointNearSegment = (
    p1: Point,
    p2: Point,
    mouse: Point,
    radius: number,
  ) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    const mx = mouse.x - p1.x;
    const my = mouse.y - p1.y;

    const lengthSq = dx * dx + dy * dy;
    if (lengthSq === 0) return false;

    const t = (mx * dx + my * dy) / lengthSq;

    const clampedT = Math.max(0, Math.min(1, t));

    const closestX = p1.x + dx * clampedT;
    const closestY = p1.y + dy * clampedT;

    const distX = mouse.x - closestX;
    const distY = mouse.y - closestY;

    const distance = Math.sqrt(distX * distX + distY * distY);

    return distance < radius;
  };

  const findStrokeIndex = (mouse: Point) => {
    const currentState = state.history[state.index];
    if (!currentState) return -1;
    // Loop over current strokes
    for (let i = strokes.length - 1; i >= 0; i--) {
      const stroke = strokes[i];
      const points = stroke.points;
      const radius = stroke.width / 2 + HIT_TOLERANCE;

      // Loop over points
      for (let j = 0; j < points.length - 1; j++) {
        const p1 = points[j];
        const p2 = points[j + 1];

        if (isPointNearSegment(p1, p2, mouse, radius)) {
          // console.log("A stroke has been hovered", i);
          return i;
        }
      }
    }
    return -1;
  };

  // This gets recreated every render: needs a fix later
  const tools = {
    pen: penTool({ redraw, setState, isDrawing, currentStroke, color, width }),
    eraser: eraserTool({
      findStrokeIndex,
      setHoveredIndex,
      handleErase,
    }),
    pan: panTool({ isPanning, viewport, setViewport, initialMousePosition }),
    select: selectTool({
      isDragging,
      dragStart,
      selectedIndexRef,
      setHoveredIndex,
      setSelectedStrokeIndex,
      findStrokeIndex,
      state,
      setState,
      initialStateRef,
    }),
  };

  // Stating the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctxRef.current = canvas.getContext("2d");
  }, []);

  useEffect(() => {
    redraw();
  }, [strokes, hoveredIndex, viewport, selectedStrokeIndex]);

  useEffect(() => {
    viewportRef.current = viewport;
    console.log("Viewport change");
  }, [viewport]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const currentViewport = viewportRef.current;

      const rect = canvas.getBoundingClientRect();
      // Get mouse coords on canvas
      const mouseCoordsOnCanvas = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      const mouseCoordsOnWorld = {
        x:
          (mouseCoordsOnCanvas.x - currentViewport.offsetX) /
          currentViewport.scale,
        y:
          (mouseCoordsOnCanvas.y - currentViewport.offsetY) /
          currentViewport.scale,
      };

      // Exponential zooming
      const k = 0.0006;
      const zoomFactor = Math.exp(-e.deltaY * k);

      let newScale = currentViewport.scale * zoomFactor;
      newScale = Math.max(0.1, Math.min(8, newScale));

      setViewport((prev) => ({
        ...prev,
        offsetX: mouseCoordsOnCanvas.x - mouseCoordsOnWorld.x * newScale,
        offsetY: mouseCoordsOnCanvas.y - mouseCoordsOnWorld.y * newScale,
        scale: newScale,
      }));
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <>
      <canvas
        style={{ border: "1px solid red" }}
        width={500}
        height={500}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={tools[tool].onMouseUp}
        onMouseLeave={tools[tool].onMouseUp}
      />
      <button onClick={handleUndo} disabled={state.index === 0}>
        Undo
      </button>
      <button
        onClick={handleRedo}
        disabled={state.history.length === state.index + 1}
      >
        Redo
      </button>
      <button onClick={() => setTool("pen")}>Pencil</button>
      <button onClick={() => setTool("eraser")}>Eraser</button>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <input
        type="range"
        value={width}
        min={1}
        max={20}
        onChange={(e) => setWidth(Number(e.target.value))}
      />
      <button onClick={() => setTool("pan")}>Pan</button>
      <button onClick={() => setTool("select")}>Select</button>
    </>
  );
}

export default Canvas;
