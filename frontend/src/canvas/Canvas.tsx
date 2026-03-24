import React, { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

type Stroke = {
  points: Point[];
  width: number;
};

type CanvasState = Stroke[];

type State = {
  history: CanvasState[];
  index: number;
};

const HIT_TOLERANCE = 4;
const BASE_LINE_WIDTH = 5;

function Canvas() {
  const [state, setState] = useState<State>({ history: [[]], index: 0 });
  const [tool, setTool] = useState<"draw" | "erase">("draw");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentStroke = useRef<Stroke | null>(null);
  const isDrawing = useRef(false);

  // Current canvas state
  const strokes = state.history[state.index] || [];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    isDrawing.current = true;

    if (tool === "erase") {
      handleErase(e);
      return;
    }

    const point = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    // Starting point of the current stroke
    currentStroke.current = {
      points: [point],
      width: BASE_LINE_WIDTH,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current) return;

    if (tool === "erase" && e.buttons === 1) {
      handleErase(e);
      return;
    }

    const point = getMousePos(e);

    currentStroke.current?.points.push(point);

    redraw();
  };

  const handleMouseUp = () => {
    if (tool === "erase") {
      isDrawing.current = false;
      return;
    }

    const stroke = currentStroke.current;
    if (!stroke) return;

    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.index + 1);
      const newState = [...newHistory[newHistory.length - 1], stroke];

      newHistory.push(newState);

      return {
        history: newHistory,
        index: prev.index + 1,
      };
    });

    currentStroke.current = null;
    isDrawing.current = false;
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, 500, 500);

    // Render the stroke
    const allStrokes = [
      ...strokes,
      ...(currentStroke.current ? [currentStroke.current] : []),
    ];

    allStrokes.forEach((stroke) => {
      ctx.beginPath();

      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
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

  const handleErase = (e: React.MouseEvent) => {
    const mousePos = getMousePos(e);
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

        if (isPointNearSegment(p1, p2, mouse, radius)) return i;
      }
    }
    return -1;
  };

  const getMousePos = (e: React.MouseEvent) => {
    return {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  };

  useEffect(() => {
    redraw();
    console.log(state.history[state.history.length - 1]);
  }, [strokes]);

  return (
    <>
      <canvas
        style={{ border: "1px solid red" }}
        width={500}
        height={500}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
      <button onClick={() => setTool("draw")}>Pencil</button>
      <button onClick={() => setTool("erase")}>Eraser</button>
    </>
  );
}

export default Canvas;
