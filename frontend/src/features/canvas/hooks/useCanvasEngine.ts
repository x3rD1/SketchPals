import { useEffect, useRef } from "react";
import useCanvas2D from "./useCanvas2D";
import useCanvasHistory from "./useCanvasHistory";
import useCanvasRenderer from "./useCanvasRenderer";
import useCanvasStroke from "./useCanvasStroke";
import useCanvasViewport from "./useCanvasViewport";
import useCanvasData from "./useCanvasData";
import { useParams } from "react-router-dom";

export default function useCanvasEngine() {
  const hasHydrated = useRef<boolean>(false);
  const { id } = useParams();

  const canvasRef = useCanvas2D();

  const history = useCanvasHistory();

  const stroke = useCanvasStroke();

  const viewport = useCanvasViewport(canvasRef);

  const renderer = useCanvasRenderer({
    canvasRef,
    strokes: history.strokes,
    currentStroke: stroke.currentStroke,
    viewport: viewport.viewport,
  });

  const data = useCanvasData(id, history.setState);

  // Create canvas if no id
  useEffect(() => {
    if (id) return;
    if (data.hasCreatedCanvas.current) return;

    data.markCanvasAsCreated();

    data.saveMutation.mutate();
  }, [id, data]);

  // Hydrate local state using query data on first mount only
  useEffect(() => {
    if (!data.canvasQuery.data) return;
    if (hasHydrated.current) return;

    hasHydrated.current = true;

    // Update local version from database
    data.setVersion(data.canvasQuery.data.version);

    // Update local history with existing
    history.setState({ history: [data.canvasQuery.data.strokes], index: 0 });
  }, [data, history]);

  return {
    id,

    canvasRef,

    data,
    history,
    stroke,
    viewport,
    renderer,
  };
}
