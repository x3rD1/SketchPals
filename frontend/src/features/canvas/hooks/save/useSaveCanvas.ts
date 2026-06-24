import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCanvas } from "../../api/canvas";
import type { CanvasEngine, CanvasOp } from "../../types/types";
import toast from "react-hot-toast";

type SaveCanvasVars = {
  ops: CanvasOp[];
  thumbnail?: string;
};

function useSaveCanvas(engine: CanvasEngine) {
  const saveCanvasMutation = ({ ops, thumbnail }: SaveCanvasVars) =>
    saveCanvas(engine.id!, ops, engine.data.version, thumbnail);

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

    onError: (_, variables) => {
      const ops = variables.ops;

      // TODO:
      // Failed save can restore ops in incorrect order if
      // new ops are queued while request is in-flight.
      ops.forEach((item) => engine.canvasOpsQueueRef.current.push(item));

      toast.error("Failed to save.", { id: "save" });
    },
  });

  return saveMutation;
}

export default useSaveCanvas;
