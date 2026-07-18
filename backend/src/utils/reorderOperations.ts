import { CanvasOp } from "../features/canvas/canvas.types";

function reorderOps(ops: CanvasOp[]) {
  const firstItem = ops.shift();
  if (!firstItem) return ops;

  ops.push(firstItem);

  return ops;
}

export default reorderOps;
