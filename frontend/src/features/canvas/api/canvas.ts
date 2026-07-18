import { api } from "../../api/client";
import type { CanvasData } from "../types/types";

export const getCanvasById = async (
  id: string | undefined,
): Promise<CanvasData> => {
  return api.get(`/canvas/${id}`);
};

export const createCanvas = async () => {
  return api.post("/canvas");
};

export const saveCanvas = async (id: string, formData: FormData) => {
  return api.patch(`/canvas/${id}`, formData);
};
