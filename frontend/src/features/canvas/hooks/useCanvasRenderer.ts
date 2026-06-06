import { useCallback, useEffect, useRef, useState } from "react";
import { getSelectionBounds } from "../utils/utils";
import type { Point, RenderDeps } from "../types/types";

export default function useCanvasRenderer({
  canvasRef,
  strokes,
  currentStroke,
  viewport,
}: RenderDeps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedIdsRef = useRef<Set<string>>(new Set());

  const startPointRef = useRef<Point>(null);
  const endPointRef = useRef<Point>(null);

  const redraw = useCallback(() => {
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

    allStrokes.forEach((stroke) => {
      ctx.beginPath();

      stroke.points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Update color on hover/select
      if (selectedIds.has(stroke.id)) {
        // Stroke's outline on select
        ctx.shadowColor = "rgb(0, 64, 255)";
        ctx.shadowBlur = 8;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Stroke's properties
        ctx.lineWidth = stroke.width;
        ctx.strokeStyle = "black";
        ctx.stroke();
      } else if (stroke.id === hoveredId) {
        ctx.lineWidth = stroke.width;
        ctx.strokeStyle = "gray";
        ctx.stroke();
      } else {
        ctx.lineWidth = stroke.width;
        ctx.strokeStyle = stroke.color;
        ctx.stroke();
      }
    });

    if (startPointRef.current !== null && endPointRef.current !== null) {
      const { left, top, width, height } = getSelectionBounds(
        startPointRef.current,
        endPointRef.current,
      );

      // Draw filled rect with color
      ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
      ctx.fillRect(left, top, width, height);

      // Add outline border
      ctx.strokeStyle = "rgba(0, 0, 150)";
      ctx.lineWidth = 1;
      ctx.strokeRect(left, top, width, height);
    }
  }, [canvasRef, currentStroke, hoveredId, selectedIds, strokes, viewport]);

  useEffect(() => {
    redraw();
  }, [redraw, hoveredId, viewport, selectedIds]);

  return {
    setHoveredId,
    setSelectedIds,
    selectedIdsRef,
    startPointRef,
    endPointRef,
    redraw,
  };
}
