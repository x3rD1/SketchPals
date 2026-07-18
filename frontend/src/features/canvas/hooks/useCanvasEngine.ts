import { useEffect, useRef } from "react";
import useCanvas2D from "./useCanvas2D";
import useCanvasHistory from "./useCanvasHistory";
import useCanvasRenderer from "./useCanvasRenderer";
import useCanvasStroke from "./useCanvasStroke";
import useCanvasViewport from "./useCanvasViewport";
import useCanvasData from "./useCanvasData";
import { useParams } from "react-router-dom";
import { deserializeStrokes } from "../utils/strokeSerialization";
import type { CanvasOp } from "../types/types";

export default function useCanvasEngine() {
  const { id } = useParams();

  if (!id) {
    throw new Error("Missing canvas id");
  }

  const hasHydrated = useRef<boolean>(false);
  const canvasOpsQueueRef = useRef<CanvasOp[]>([]);

  const enqueueOp = (op: CanvasOp) => {
    canvasOpsQueueRef.current.push(op);
  };

  const drainOps = () => {
    return canvasOpsQueueRef.current.splice(0);
  };

  const canvas2D = useCanvas2D();

  const { state, setState, strokes, handleUndo, handleRedo, handleErase } =
    useCanvasHistory(enqueueOp);

  const stroke = useCanvasStroke();

  const viewport = useCanvasViewport(canvas2D.canvasRef);

  const renderer = useCanvasRenderer({
    canvasRef: canvas2D.canvasRef,
    strokes,
    currentStroke: stroke.currentStroke,
    viewport: viewport.viewport,
  });

  const canvasData = useCanvasData(id);

  // Hydrate local state using query data
  useEffect(() => {
    if (!canvasData.data) return;

    hasHydrated.current = true;

    // Deserialize stroke.points from number[] to Point[]
    const deserializedStrokes = deserializeStrokes(canvasData.data.strokes);

    // Update local history with existing
    setState({ history: [deserializedStrokes], index: 0 });
  }, [canvasData.data, setState]);

  return {
    canvasOpsQueueRef,
    enqueueOp,
    drainOps,

    hasHydrated,

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
