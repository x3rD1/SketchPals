import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createCanvas, getCanvasById } from "../api/canvas";
import { useState } from "react";
import type { State } from "../types/types";

export default function useCanvasData(
  id: string | undefined,
  setState: React.Dispatch<React.SetStateAction<State>>,
) {
  const [version, setVersion] = useState<number>(0);

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
  });

  return {
    version,
    setVersion,

    canvasQuery,
    saveMutation,
  };
}
