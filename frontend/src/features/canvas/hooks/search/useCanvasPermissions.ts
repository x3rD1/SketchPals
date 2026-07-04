import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPermission, removePermission } from "../../api/users";
import type { User } from "../../api/types";

function useCanvasPermissions(search: string, canvasId: string) {
  const queryClient = useQueryClient();

  const addCanvasMember = useMutation({
    mutationFn: createPermission,
    onSuccess: (data) => {
      queryClient.setQueryData<User[] | undefined>(
        ["permitted-users", canvasId],
        (old) => [...(old ?? []), data],
      );

      queryClient.setQueryData<User[] | undefined>(
        ["search-users", { search, canvasId }],
        (old) => old?.filter((o) => o.id !== data?.id),
      );
    },
  });

  const removeCanvasMember = useMutation({
    mutationFn: removePermission,

    onSuccess: (_, variables) => {
      queryClient.setQueryData<User[] | undefined>(
        ["permitted-users", canvasId],
        (old) => {
          return old?.filter((o) => o.id !== variables.memberId);
        },
      );
    },
  });

  return { addCanvasMember, removeCanvasMember };
}

export default useCanvasPermissions;
