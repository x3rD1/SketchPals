import { prisma } from "../../lib/prisma";

export const getAllCanvases = async () => {
  const canvases = await prisma.canvas.findMany({
    orderBy: { createdAt: "desc" },
  });

  return canvases;
};
