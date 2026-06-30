import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../api/fetchMe";

function useAuth() {
  const { data, isPending } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });

  return { isPending, isAuthenticated: !!data?.user };
}

export default useAuth;
