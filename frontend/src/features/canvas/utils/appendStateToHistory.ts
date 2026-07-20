import type { CanvasState, State, Stroke } from "../types/types";

type Action = "add" | "delete" | "move";
type AppendStateOptions = {
  newCanvasState?: CanvasState;
  idsToRemove?: string[];
};

function appendStateToHistory(
  action: Action,
  prevState: State,
  options: AppendStateOptions,
) {
  const currentIndex = prevState.index;

  const newHistory = prevState.history.slice(0, currentIndex + 1);

  let newState: Stroke[];
  switch (action) {
    case "add":
      newState = [
        ...newHistory[newHistory.length - 1],
        ...options.newCanvasState!,
      ];
      break;

    case "delete":
      newState = [
        ...newHistory[newHistory.length - 1].filter(
          (stroke) => !options.idsToRemove?.some((id) => id === stroke.id),
        ),
      ];
      break;

    case "move":
      newState = [
        ...newHistory[newHistory.length - 1].filter(
          (stroke) => !options.newCanvasState?.some((s) => s.id === stroke.id),
        ),
        ...options.newCanvasState!,
      ];
      break;

    default:
      throw new Error("Unhandled state update");
  }

  newHistory.push(newState);

  return {
    history: newHistory,
    index: currentIndex + 1,
  };
}

export default appendStateToHistory;
