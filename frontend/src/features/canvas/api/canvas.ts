export const getCanvasById = async (id: string | undefined) => {
  const res = await fetch(`http://localhost:3000/canvas/${id}`, {
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};

export const createCanvas = async () => {
  const res = await fetch("http://localhost:3000/canvas", {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};

export const saveCanvas = async (id: string, formData: FormData) => {
  const res = await fetch(`http://localhost:3000/canvas/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.error);

  return data;
};
