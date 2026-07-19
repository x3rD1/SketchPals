import { socket } from "../../../socket/socket";
import type { CanvasOp } from "../types/types";

function emitOpEvents(canvasId: string, ops: CanvasOp[]) {
  ops.forEach((op) => {
    if (op.type === "add") {
      socket.emit("canvas:draw", { canvasId, op });
    }

    if (op.type === "delete") {
      socket.emit("canvas:erase", { canvasId, op });
    }

    if (op.type === "move") {
      socket.emit("canvas:move", { canvasId, op });
    }
  });
}

export default emitOpEvents;
