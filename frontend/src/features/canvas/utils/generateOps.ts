import type { CanvasOp, Stroke } from "../types/types";
import { serializeStroke } from "./strokeSerialization";

function generateOps(fromState: Stroke[], toState: Stroke[]) {
  const ops: CanvasOp[] = [];

  const fromIds = new Set(fromState.map((s) => s.id));
  const toIds = new Set(toState.map((s) => s.id));

  // Added strokes
  for (const stroke of toState) {
    if (!fromIds.has(stroke.id)) {
      ops.push({
        type: "add",
        strokes: [serializeStroke(stroke)],
      });
    }
  }

  // Deleted strokes
  for (const stroke of fromState) {
    if (!toIds.has(stroke.id)) {
      ops.push({
        type: "delete",
        ids: [stroke.id],
      });
    }
  }

  const fromMap = new Map(fromState.map((s) => [s.id, s]));
  const toMap = new Map(toState.map((s) => [s.id, s]));

  const movedStrokes = [];

  for (const [id, fromStroke] of fromMap) {
    const toStroke = toMap.get(id);

    if (!toStroke) continue;

    const moved =
      JSON.stringify(fromStroke.points) !== JSON.stringify(toStroke.points);

    if (moved) {
      movedStrokes.push(serializeStroke(toStroke));
    }
  }

  if (movedStrokes.length > 0) {
    ops.push({
      type: "move",
      strokes: movedStrokes,
    });
  }

  return ops;
}

export default generateOps;
