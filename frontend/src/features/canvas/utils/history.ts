import type { State } from "../types/types";

export const deleteSelectedStroke = (
  setState: React.Dispatch<React.SetStateAction<State>>,
  selectedIds: Set<string>,
) => {
  setState((prev) => {
    const currentIndex = prev.index;
    const newHistory = prev.history.slice(0, currentIndex + 1);
    const currentState = newHistory[currentIndex];

    const updatedState = currentState.filter(
      (stroke) => !selectedIds.has(stroke.id),
    );

    newHistory.push(updatedState);

    return {
      history: newHistory,
      index: prev.index + 1,
    };
  });
};
