import { useQuery } from "@tanstack/react-query";
import { getCanvasById } from "../api/canvas";
import { useState } from "react";

export default function useCanvasData(id: string) {
  const [version, setVersion] = useState<number>(0);

  const canvasQuery = useQuery({
    queryKey: ["canvas", id],
    queryFn: () => getCanvasById(id),
    enabled: !!id,
    retry: false,
  });

  return {
    version,
    setVersion,

    canvasQuery,
  };
}
