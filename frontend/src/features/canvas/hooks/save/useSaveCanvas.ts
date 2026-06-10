import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveCanvas } from "../../api/canvas";
import type { Stroke } from "../../types/types";

type SaveCanvasMutationVariables = {
  id: string;
  strokes: Stroke[];
  version: number;
  thumbnail: string | undefined;
};

function useSaveCanvas() {
  const saveCanvasMutation = ({
    id,
    strokes,
    version,
    thumbnail,
  }: SaveCanvasMutationVariables) =>
    saveCanvas(id, strokes, version, thumbnail);

  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: saveCanvasMutation,

    onSuccess: (data, variables) => {
      // Update canvasQuery cache immediately on save
      queryClient.setQueryData(["canvas", variables.id], data);

      // Invalidate dashboard cache
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },

    onError: (error) => alert(error),
  });
  return saveMutation;
}

export default useSaveCanvas;
