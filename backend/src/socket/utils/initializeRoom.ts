import { CanvasOp } from "../../features/canvas/canvas.types";

const moveOp: CanvasOp = { type: "move", strokes: [] };

function initializeRoom(
  roomState: Record<string, CanvasOp[]>,
  canvasId: string,
) {
  roomState[canvasId] = [];
  roomState[canvasId].push(moveOp);
}

export default initializeRoom;
