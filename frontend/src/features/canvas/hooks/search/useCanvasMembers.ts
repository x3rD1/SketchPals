import { useQuery } from "@tanstack/react-query";
import { getMembers } from "../../api/users";

function useCanvasMembers(canvasId: string) {
  const { data } = useQuery({
    queryKey: ["permitted-users", canvasId],
    queryFn: () => getMembers(canvasId),
    enabled: !!canvasId,
  });

  return { data };
}

export default useCanvasMembers;
