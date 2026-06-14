import type { Canvas } from "../types/types";

export const getAllCanvases = async (): Promise<Canvas[]> => {
  const res = await fetch("http://localhost:3000/dashboard");

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};
