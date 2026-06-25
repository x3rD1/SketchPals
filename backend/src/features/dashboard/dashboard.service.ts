import cloudinary from "../../config/cloudinary";
import { prisma } from "../../lib/prisma";

export const getAllCanvases = async () => {
  const canvases = await prisma.canvas.findMany({
    orderBy: { createdAt: "desc" },
  });

  return canvases.map((c) => ({
    ...c,
    thumbnail: cloudinary.url(c.thumbnailPublicId!, {
      width: 400,
      height: 250,
      crop: "fill",
      quality: "auto",
      fetch_format: "auto",
    }),
  }));
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
