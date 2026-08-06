import type { JoinCanvasAck } from "../hooks/socket/useCanvasRoom";
import { deserializeStrokes } from "./strokeSerialization";

function createLiveCanvas(response: JoinCanvasAck) {
  const strokes = {
    persisted: deserializeStrokes(response.persisted),
    unsaved: deserializeStrokes(response.drawStrokes),
    erasedIds: response.eraseIds,
    moved: deserializeStrokes(response.moveStrokes),
  };

  const liveCanvas = strokes.persisted
    .concat(strokes.unsaved)
    .filter((stroke) => !strokes.erasedIds.some((id) => id === stroke.id))
    .filter((stroke) => !strokes.moved.some((s) => s.id === stroke.id))
    .concat(strokes.moved);

  return liveCanvas;
}

export default createLiveCanvas;
