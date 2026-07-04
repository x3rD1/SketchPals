import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "../../api/users";

function useSearchUser(search: string, canvasId: string) {
  const { data } = useQuery({
    queryKey: ["search-users", { search, canvasId }],
    queryFn: () => searchUsers(search, canvasId),
    enabled: search.length > 0,
  });

  return { data };
}

export default useSearchUser;
