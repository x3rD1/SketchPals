import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCanvas } from "../../api/canvas";
import type { CanvasEngine } from "../../types/types";
import toast from "react-hot-toast";
import { serializeStrokes } from "../../utils/strokeSerialization";

function useSaveCanvas(engine: CanvasEngine) {
  // Convert stroke points from [{x,y}] to [x,y]
  const serializedStrokes = serializeStrokes(engine.history.strokes);

  const saveCanvasMutation = (thumbnail: string | undefined) =>
    saveCanvas(engine.id!, serializedStrokes, engine.data.version, thumbnail);

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: saveCanvasMutation,

    onMutate: () => toast.loading("Saving...", { id: "save" }),

    onSuccess: (data) => {
      // Update canvasQuery cache immediately on save
      queryClient.setQueryData(["canvas", engine.id], data);

      // Invalidate dashboard cache
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      engine.data.setVersion(data.version);

      toast.success("Canvas saved.", { id: "save" });
    },

    onError: () => toast.error("Failed to save.", { id: "save" }),
  });

  return saveMutation;
}

export default useSaveCanvas;
