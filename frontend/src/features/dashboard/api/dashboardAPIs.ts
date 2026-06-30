import { api } from "../../api/client";
import type { Canvas } from "../types/types";

export const getAllCanvases = async (): Promise<Canvas[]> => {
  return api.get("/dashboard");
};

export const updateCanvasTitle = async (
  id: string,
  title: string,
): Promise<Canvas> => {
  return api.patch(`/dashboard/${id}`, title);
};
