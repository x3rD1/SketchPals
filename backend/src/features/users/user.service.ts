import { prisma } from "../../lib/prisma";

export const getUsers = async ({
  input,
  currentUser,
  canvasId,
}: {
  input: string;
  currentUser: string;
  canvasId: string;
}) => {
  const canvas = await prisma.canvas.findUnique({ where: { id: canvasId } });

  if (!canvas) throw new Error("Canvas not found");

  return await prisma.user.findMany({
    where: {
      id: { not: currentUser },
      email: { contains: input },
      sharedCanvases: { none: { canvasId } },
    },
    select: { id: true, username: true, email: true },
  });
};
