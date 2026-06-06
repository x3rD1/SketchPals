import { useRef, useState } from "react";
import type { Stroke } from "../types/types";

export default function useCanvasStroke() {
  const currentStroke = useRef<Stroke | null>(null);

  const [color, setColor] = useState("#000000");
  const [width, setWidth] = useState(5);

  return { currentStroke, color, setColor, width, setWidth };
}
