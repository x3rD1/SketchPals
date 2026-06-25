import type { Canvas } from "../types/types";

export const getAllCanvases = async (): Promise<Canvas[]> => {
  const res = await fetch("http://localhost:3000/dashboard");

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const updateCanvasTitle = async (
  id: string,
  title: string,
): Promise<Canvas> => {
  const res = await fetch(`http://localhost:3000/dashboard/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};
