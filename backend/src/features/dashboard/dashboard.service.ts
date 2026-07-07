import cloudinary from "../../config/cloudinary";
import { prisma } from "../../lib/prisma";

export const getAllCanvases = async (userId: string) => {
  const canvases = await prisma.canvas.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return canvases.map((c) => {
    const canManage = c.userId === userId;

    return {
      ...c,
      canManage,
      thumbnail: cloudinary.url(c.thumbnailPublicId!, {
        width: 400,
        height: 250,
        crop: "fill",
        quality: "auto",
        fetch_format: "auto",
      }),
    };
  });
};

export const updateCanvasTitle = async (data: {
  id: string;
  title: string;
  userId: string;
}) => {
  const canvas = await prisma.canvas.update({
    where: { id: data.id, userId: data.userId },
    data: { title: data.title },
  });

  return canvas;
};

export const getAllSharedCanvases = async (userId: string) => {
  const canvases = await prisma.canvas.findMany({
    where: { sharedWith: { some: { userId } } },
  });

  return canvases.map((canvas) => {
    const canManage = canvas.userId === userId;

    return { ...canvas, canManage };
  });
};
