import { CanvasOp } from "../../features/canvas/canvas.types";

function reorderOps(ops: CanvasOp[]) {
  const moveOp = ops.filter((op) => op.type === "move");

  const reordered: CanvasOp[] = ops.filter((op) => op.type !== "move");

  const orderedOps = reordered.concat(moveOp);

  return orderedOps;
}

export default reorderOps;
