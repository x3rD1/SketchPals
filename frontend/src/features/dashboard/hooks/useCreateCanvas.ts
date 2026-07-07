import { useMutation } from "@tanstack/react-query";
import { createCanvas } from "../../canvas/api/canvas";
import { useNavigate } from "react-router-dom";

function useCreateCanvas() {
  const navigate = useNavigate();

  const createCanvasMutation = useMutation({
    mutationFn: createCanvas,

    onSuccess: (data) => {
      navigate(`/canvas/${data.id}`);
    },
  });
  return createCanvasMutation;
}

export default useCreateCanvas;
