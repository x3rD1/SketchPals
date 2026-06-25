import { useRef } from "react";

export default function useCanvas2D() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getThumbnailBlob = () =>
    new Promise<Blob>((resolve, reject) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("No blob");
          resolve(blob);
        },
        "image/webp",
        0.8,
      );
    });

  return { canvasRef, getThumbnailBlob };
}
