import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCanvasTitle } from "../api/dashboardAPIs";
import toast from "react-hot-toast";

function useSaveCanvasTitle() {
  const queryClient = useQueryClient();
  const save = useMutation({
    mutationFn: updateCanvasTitle,

    onMutate: () => toast.loading("Updating...", { id: "title" }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      toast.success("Canvas title updated!", { id: "title" });
    },

    onError: () => toast.error("Failed to change title", { id: "title" }),
  });

  return save;
}

export default useSaveCanvasTitle;
