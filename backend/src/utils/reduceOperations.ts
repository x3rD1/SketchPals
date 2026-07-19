import { CanvasOp, StrokeInput } from "../features/canvas/canvas.types";

type StrokeState = {
  added: boolean;
  deleted: boolean;
  existed: boolean;
  stroke?: StrokeInput;
  moved?: StrokeInput;
};

function reduceOperations(ops: CanvasOp[]): CanvasOp[] {
  const strokes = new Map<string, StrokeState>();

  const getState = (id: string) => {
    let state = strokes.get(id);

    if (!state) {
      state = {
        added: false,
        deleted: false,
        existed: false,
      };

      strokes.set(id, state);
    }

    return state;
  };

  for (const op of ops) {
    switch (op.type) {
      case "move":
        for (const stroke of op.strokes) {
          const state = getState(stroke.id);

          if (!state.added) {
            state.existed = true;
          }

          state.moved = stroke;
        }
        break;

      case "delete":
        for (const id of op.ids) {
          const state = getState(id);

          if (!state.added) {
            state.existed = true;
          }

          state.deleted = true;
        }
        break;

      case "add":
        for (const stroke of op.strokes) {
          const state = getState(stroke.id);

          state.stroke = stroke;

          if (!state.existed && !state.deleted) {
            state.added = true;
          }

          state.deleted = false;
        }
        break;
    }
  }

  const add: StrokeInput[] = [];
  const del: string[] = [];
  const move: StrokeInput[] = [];

  for (const [id, state] of strokes) {
    // Created and deleted inside this batch
    if (state.added && state.deleted) {
      continue;
    }

    // Stroke does not exist at the end
    if (state.deleted) {
      del.push(id);
      continue;
    }

    // New stroke
    if (state.added) {
      add.push(state.moved ?? state.stroke!);
      continue;
    }

    // Existing stroke that survived
    if (state.moved) {
      move.push(state.moved);
    }
  }

  const result: CanvasOp[] = [];

  if (add.length) {
    result.push({
      type: "add",
      strokes: add,
    });
  }

  if (del.length) {
    result.push({
      type: "delete",
      ids: del,
    });
  }

  if (move.length) {
    result.push({
      type: "move",
      strokes: move,
    });
  }

  return result;
}

export default reduceOperations;
