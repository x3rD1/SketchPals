import { CanvasOp } from "../../features/canvas/canvas.types";

function getRoom(roomState: Record<string, CanvasOp[]>, canvasId: string) {
  const room = roomState[canvasId];

  if (!room)
    throw new Error(
      "Session has expired. Please refresh the page and try again.",
    );

  return room;
}

export default getRoom;
