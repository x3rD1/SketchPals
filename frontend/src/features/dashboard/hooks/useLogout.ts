import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/api/logout";

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    queryClient.removeQueries();

    navigate("/login", { replace: true });
  };

  return handleLogout;
}

export default useLogout;
