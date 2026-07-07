import { useQuery } from "@tanstack/react-query";

import { getAllCanvases, getAllSharedCanvases } from "../api/dashboardAPIs";

function useDashboardData() {
  const canvasesQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getAllCanvases,
  });

  const sharedCanvasQuery = useQuery({
    queryKey: ["shared-canvas"],
    queryFn: getAllSharedCanvases,
  });

  return { canvasesQuery, sharedCanvasQuery };
}

export default useDashboardData;
