import { useCallback, useEffect, useRef } from "react";
import type { SaveCanvas } from "../../types/types";

type useAutosaveCanvasVars = {
  save: SaveCanvas;
};

function useAutosaveCanvas({ save }: useAutosaveCanvasVars) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    save.mutate();
  }, [save]);

  const scheduleAutosave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      commitSave();
    }, 5000);
  }, [commitSave]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [timeoutRef]);

  return { scheduleAutosave, commitSave };
}

export default useAutosaveCanvas;
