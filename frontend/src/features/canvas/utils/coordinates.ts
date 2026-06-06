import type { Viewport } from "../types/types";

export const getMousePos = (
  e: { clientX: number; clientY: number },
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  viewport: Viewport,
) => {
  const canvas = canvasRef.current;
  if (!canvas) return null;

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
