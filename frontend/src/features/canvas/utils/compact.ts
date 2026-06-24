import type { CanvasOp } from "../types/types";

// Compactor v1: This removes redundant op per stroke that has a type of move
function compact(opQueue: CanvasOp[]) {
  const seen = new Map();

  const newOpQueue = [];

  for (const op of opQueue) {
    if (op.type !== "move") {
      newOpQueue.push(op);
      continue;
    }

    const ids = op.strokes.map((s) => s.id);
    const key = JSON.stringify(ids);

    seen.set(key, op);
  }

  newOpQueue.push(...seen.values());

  return newOpQueue;
}

export default compact;
