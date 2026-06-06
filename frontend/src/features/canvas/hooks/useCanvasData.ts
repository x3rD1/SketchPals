import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createCanvas, getCanvasById } from "../api/canvas";
import { useRef, useState } from "react";
import type { State } from "../types/types";

export default function useCanvasData(
  id: string | undefined,
  setState: React.Dispatch<React.SetStateAction<State>>,
) {
  const [version, setVersion] = useState<number>(0);
  const hasCreatedCanvas = useRef(false); //Prevents double-create on dev

  const navigate = useNavigate();

  const canvasQuery = useQuery({
    queryKey: ["canvas", id],
    queryFn: () => getCanvasById(id),
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: createCanvas,

    onSuccess: (data) => {
      setVersion(data.version);
      setState({ history: [data.strokes], index: 0 });

      navigate(`/canvas/${data.id}`);
    },

    onError: () => {
      hasCreatedCanvas.current = false;
    },
  });

  const markCanvasAsCreated = () => {
    hasCreatedCanvas.current = true;
  };

  return {
    version,
    setVersion,

    hasCreatedCanvas,
    markCanvasAsCreated,

    canvasQuery,
    saveMutation,
  };
}
