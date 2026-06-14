import { useMutation, useQuery } from "@tanstack/react-query";
import { createCanvas } from "../../canvas/api/canvas";
import { getAllCanvases } from "../api/dashboardAPIs";
import { useNavigate } from "react-router-dom";

function useDashboardData() {
  const navigate = useNavigate();

  const canvasesQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getAllCanvases,
  });

  const createCanvasMutation = useMutation({
    mutationFn: createCanvas,

    onSuccess: (data) => {
      navigate(`/canvas/${data.id}`);
    },
  });

  return { canvasesQuery, createCanvasMutation };
}

export default useDashboardData;
