import useCanvas2D from "./useCanvas2D";
import useCanvasHistory from "./useCanvasHistory";
import useCanvasRenderer from "./useCanvasRenderer";
import useCanvasStroke from "./useCanvasStroke";
import useCanvasViewport from "./useCanvasViewport";
import useCanvasData from "./useCanvasData";
import { useParams } from "react-router-dom";

export default function useCanvasEngine() {
  const { id } = useParams();

  if (!id) {
    throw new Error("Missing canvas id");
  }

  const canvas2D = useCanvas2D();

  const { state, setState, strokes, handleUndo, handleRedo, handleErase } =
    useCanvasHistory(id);

  const stroke = useCanvasStroke();

  const viewport = useCanvasViewport(canvas2D.canvasRef);

  const renderer = useCanvasRenderer({
    canvasRef: canvas2D.canvasRef,
    strokes,
    currentStroke: stroke.currentStroke,
    viewport: viewport.viewport,
  });

  const canvasData = useCanvasData(id);

  return {
    id,

    canvas2D,

    canvasData,

    state,
    setState,
    strokes,
    handleUndo,
    handleRedo,
    handleErase,

    stroke,
    viewport,
    renderer,
  };
}
