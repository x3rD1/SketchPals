import type { Stroke } from "../types/types";

export const getCanvasById = async (id: string | undefined) => {
  const res = await fetch(`http://localhost:3000/canvas/${id}`);

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const createCanvas = async () => {
  const res = await fetch("http://localhost:3000/canvas", { method: "POST" });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};

export const saveCanvas = async (
  id: string,
  strokes: Stroke[],
  version: number,
) => {
  const res = await fetch(`http://localhost:3000/canvas/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ strokes, version }),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message);

  return data;
};
