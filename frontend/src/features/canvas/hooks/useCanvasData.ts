import { useQuery } from "@tanstack/react-query";
import { getCanvasById } from "../api/canvas";

export default function useCanvasData(id: string) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["canvas", id],
    queryFn: () => getCanvasById(id),
    enabled: !!id,
    retry: false,
  });

  return {
    data,
    isPending,
    isError,
    error,
  };
}
