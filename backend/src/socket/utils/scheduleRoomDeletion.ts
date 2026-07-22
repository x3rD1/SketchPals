import { Server } from "socket.io";
import { CanvasOp } from "../../features/canvas/canvas.types";

const ROOM_GRACE_PERIOD_SECONDS = 30;

const roomTimers: Map<string, NodeJS.Timeout> = new Map();

export function scheduleRoomDeletion(
  io: Server,
  roomState: Record<string, CanvasOp[]>,
  canvasId: string,
) {
  if (roomTimers.has(canvasId)) {
    return;
  }

  const room = io.sockets.adapter.rooms.get(canvasId);

  if (room?.size) {
    return;
  }

  const timeout = setTimeout(() => {
    if (room?.size) {
      roomTimers.delete(canvasId);
      return;
    }

    delete roomState[canvasId];

    roomTimers.delete(canvasId);
  }, 1000 * ROOM_GRACE_PERIOD_SECONDS);

  roomTimers.set(canvasId, timeout);
}

export function cancelRoomDeletion(canvasId: string) {
  const timeout = roomTimers.get(canvasId);

  if (timeout) {
    clearTimeout(timeout);

    roomTimers.delete(canvasId);
  }
}
