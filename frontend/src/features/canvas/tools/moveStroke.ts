import { socket } from "../../../socket/socket";
import type { CanvasOp, Stroke } from "../types/types";
import { serializeStroke } from "../utils/strokeSerialization";

function moveStrokes(
  canvasId: string,
  movedStrokes: Stroke[],
  scheduleAutosave: () => void,
) {
  const op = {
    type: "move",
    strokes: movedStrokes.map((stroke) => serializeStroke(stroke)),
  } satisfies CanvasOp;

  socket.emit("canvas:move", { canvasId, op });

  scheduleAutosave();
}

export default moveStrokes;
