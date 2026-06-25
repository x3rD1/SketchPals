import { useCallback, useRef } from "react";
import type { CanvasEngine, SaveCanvas } from "../../types/types";
import compact from "../../utils/compact";
import toast from "react-hot-toast";

type useAutosaveCanvasVars = {
  save: SaveCanvas;
  engine: CanvasEngine;
};

function useAutosaveCanvas({ save, engine }: useAutosaveCanvasVars) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Capture a snapshot of engine.canvasOpsQueueRef.current and clear it
    const drainedOps = engine.drainOps();
    if (drainedOps.length === 0) {
      toast.success("Canvas is already up to date.");
      return;
    }

    const compactedOps = compact(drainedOps);

    console.log(compactedOps);

    save.mutate({ ops: compactedOps });
  }, [save, engine]);

  const scheduleAutosave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      commitSave();
    }, 5000);
  }, [commitSave]);

  return { scheduleAutosave, commitSave };
}

export default useAutosaveCanvas;
