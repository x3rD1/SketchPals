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
  const hasHydrated = useRef<boolean>(false);
  const canvasOpsQueueRef = useRef<CanvasOp[]>([]);

  const enqueueOp = (op: CanvasOp) => {
    canvasOpsQueueRef.current.push(op);
  };

  const drainOps = () => {
    return canvasOpsQueueRef.current.splice(0);
  };

  const { id } = useParams();

  const canvas2D = useCanvas2D();

  const history = useCanvasHistory(enqueueOp);

  const stroke = useCanvasStroke();

  const viewport = useCanvasViewport(canvas2D.canvasRef);

  const renderer = useCanvasRenderer({
    canvasRef: canvas2D.canvasRef,
    strokes: history.strokes,
    currentStroke: stroke.currentStroke,
    viewport: viewport.viewport,
  });

  const data = useCanvasData(id);

  // Hydrate local state using query data on first mount only
  useEffect(() => {
    if (!data.canvasQuery.data) return;
    if (hasHydrated.current) return;

    hasHydrated.current = true;

    // Update local version from database
    data.setVersion(data.canvasQuery.data.version);

    // Deserialize stroke.points from number[] to Point[]
    const deserializedStrokes = deserializeStrokes(
      data.canvasQuery.data.strokes,
    );

    // Update local history with existing
    history.setState({ history: [deserializedStrokes], index: 0 });
  }, [data, history]);

  return {
    enqueueOp,
    drainOps,

    id,

    canvas2D,

    data,
    history,
    stroke,
    viewport,
    renderer,
  };
}
