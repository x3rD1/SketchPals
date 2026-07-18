import { socket } from "../../../socket/socket";
import type { CanvasOp } from "../types/types";

function eraseStroke(
  canvasId: string,
  idsToRemove: string[],
  scheduleAutosave: () => void,
) {
  if (idsToRemove.length === 0) return;

  const op = { type: "delete", ids: idsToRemove } satisfies CanvasOp;

  socket.emit("canvas:erase", { canvasId, op });

  scheduleAutosave();
}

export default eraseStroke;
