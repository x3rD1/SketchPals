import { useRef } from "react";

export default function useCanvas2D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateThumbnail = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      throw new Error("Canvas not initialized");
    }

    return canvas.toDataURL("image/webp", 0.8);
  };

  return { canvasRef, generateThumbnail };
}
