import { socket } from "../../../socket/socket";
import type { CanvasOp, Stroke } from "../types/types";
import { serializeStroke } from "../utils/strokeSerialization";

function commitStroke(
  canvasId: string,
  stroke: Stroke,
  scheduleAutosave: () => void,
) {
  const op = {
    type: "add",
    strokes: [serializeStroke(stroke)],
  } satisfies CanvasOp;

  socket.emit("canvas:draw", { canvasId, op });

  scheduleAutosave();
}

export default commitStroke;
