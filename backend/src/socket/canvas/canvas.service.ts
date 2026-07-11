import { requireCanvasAccess } from "../../features/canvas/canvas.service";
import { prisma } from "../../lib/prisma";

export const hasAccess = (canvasId: string, userId: string) => {
  return requireCanvasAccess(prisma, canvasId, userId);
};
