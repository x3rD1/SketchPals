import { useEffect, useRef, useState } from "react";
import type { Viewport } from "../types/types";

export default function useCanvasViewport(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const [viewport, setViewport] = useState<Viewport>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const viewportRef = useRef(viewport);

  useEffect(() => {
    viewportRef.current = viewport;
  }, [viewport]);

  // Zoom in/out using mouse wheel
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
  }, [canvasRef]);

  return { viewport, setViewport, viewportRef };
}
