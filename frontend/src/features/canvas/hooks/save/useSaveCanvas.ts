import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CanvasData, CanvasEngine } from "../../types/types";
import toast from "react-hot-toast";
import { socket } from "../../../../socket/socket";

type SaveAck = {
  success: boolean;
  message: string;
  data: CanvasData;
};

function useSaveCanvas(engine: CanvasEngine) {
  const saveCanvasMutation = async () => {
    const blob = await engine.canvas2D.getThumbnailBlob();
    const arrayBuffer = await blob.arrayBuffer();

    return new Promise<CanvasData>((resolve, reject) => {
      socket.emit(
        "canvas:save",
        {
          canvasId: engine.id,
          image: arrayBuffer,
          version: engine.canvasData.data?.version,
        },
        (response: SaveAck) => {
          if (response.success) {
            resolve(response.data);
          } else {
            reject(new Error(response.message));
          }
        },
      );
    });
  };

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: saveCanvasMutation,

    onMutate: () => toast.loading("Saving...", { id: "save" }),

    onSuccess: (data) => {
      // Update canvasQuery cache immediately on save
      queryClient.setQueryData(["canvas", engine.id], data);

      // Invalidate dashboard cache
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      toast.success("Canvas saved.", { id: "save" });
    },

    onError: (error) => {
      toast.error(error.message, { id: "save" });
    },
  });

  return saveMutation;
}

export default useSaveCanvas;
