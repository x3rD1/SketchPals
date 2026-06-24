import { useState } from "react";
import type { CanvasOp, State } from "../types/types";
import generateOps from "../utils/generateOps";

export default function useCanvasHistory(enqueueOp: (op: CanvasOp) => void) {
  const [state, setState] = useState<State>({ history: [[]], index: 0 });

  const strokes = state.history[state.index];

  const handleUndo = () => {
    if (state.index === 0) return;

    const currentState = state.history[state.index];
    const previewState = state.history[state.index - 1];

    const ops = generateOps(currentState, previewState);
    ops.forEach((op) => enqueueOp(op));

    setState((prev) => ({ ...prev, index: prev.index - 1 }));
  };

  const handleRedo = () => {
    if (state.history.length === state.index + 1) return;

    const currentState = state.history[state.index];
    const nextState = state.history[state.index + 1];

    const ops = generateOps(currentState, nextState);
    ops.forEach((op) => enqueueOp(op));

    setState((prev) => ({ ...prev, index: prev.index + 1 }));
  };

  const handleErase = (idToRemove: string) => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.index + 1);
      const lastState = newHistory[newHistory.length - 1];

      if (!lastState) return prev;

      const newState = lastState.filter((stroke) => stroke.id !== idToRemove);

      newHistory.push(newState);

      return {
        history: newHistory,
        index: prev.index + 1,
      };
    });
  };

  return {
    state,
    setState,

    strokes,

    handleUndo,
    handleRedo,
    handleErase,
  };
}
