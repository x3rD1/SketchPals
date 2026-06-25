import { prisma } from "../../lib/prisma";

export const getAllCanvases = async () => {
  const canvases = await prisma.canvas.findMany({
    orderBy: { createdAt: "desc" },
  });

  return canvases;
};

export const updateCanvasTitle = async (data: {
  id: string;
  title: string;
}) => {
  const canvas = await prisma.canvas.update({
    where: { id: data.id },
    data: { title: data.title },
  });

  return canvas;
};
