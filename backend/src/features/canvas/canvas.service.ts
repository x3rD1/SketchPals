import cloudinary from "../../config/cloudinary";
import { AppError } from "../../errors/appError";
import { prisma, Prisma } from "../../lib/prisma";
import { uploadThumbnail } from "../../lib/uploadThumbnail";
import { CanvasOp } from "./canvas.types";

export const getCanvasById = async (id: string, userId: string) => {
  const canvas = await prisma.canvas.findUnique({
    where: { id, userId },
    include: { strokes: true },
  });

  if (!canvas) throw new AppError("Canvas not found", 404, "CANVAS_NOT_FOUND");

  return canvas;
};

export const createCanvas = async (userId: string) => {
  const canvas = await prisma.canvas.create({
    data: {
      userId,
      title: "Untitled",
      thumbnail: "https://placehold.co/500x500",
    },
    include: { strokes: true },
  });

  return canvas;
};

export const updateCanvas = async ({
  id,
  ops,
  version,
  file,
  userId,
}: {
  id: string;
  ops: CanvasOp[];
  version: number;
  file: Express.Multer.File;
  userId: string;
}) =>
  await prisma.$transaction(async (tx) => {
    if (ops.length > 0) {
      const canvas = await tx.canvas.findUnique({ where: { id, userId } });
      if (!canvas)
        throw new AppError("Canvas not found", 404, "CANVAS_NOT_FOUND");

      if (canvas.version !== version)
        throw new AppError(
          "Canvas version conflict",
          400,
          "CANVAS_VERSION_CONFLICT",
        );

      for (const op of ops) {
        if (op.type === "add") {
          for (const stroke of op.strokes) {
            await tx.stroke.create({
              data: {
                id: stroke.id,
                points: stroke.points,
                width: stroke.width,
                color: stroke.color,
                canvasId: id,
              },
            });
          }
        }

        if (op.type === "move") {
          for (const stroke of op.strokes) {
            await tx.stroke.update({
              where: { id: stroke.id },
              data: {
                points: stroke.points,
              },
            });
          }
        }

        if (op.type === "delete") {
          if (!op.ids)
            throw new AppError("Missing stroke id", 400, "INVALID_OP");
          console.log("deleted");
          for (const id of op.ids) {
            await tx.stroke.delete({ where: { id } });
          }
        }
      }

      if (canvas.thumbnailPublicId)
        await cloudinary.uploader.destroy(canvas.thumbnailPublicId);
    }

    const uploadResult = await uploadThumbnail(file);

    return tx.canvas.update({
      where: { id, userId },
      data: {
        version: { increment: 1 },
        thumbnail: uploadResult.secure_url,
        thumbnailPublicId: uploadResult.public_id,
      },
      include: { strokes: true },
    });
  });

export const getCanvasMembers = async (canvasId: string) => {
  const canvas = await prisma.canvas.findUnique({ where: { id: canvasId } });

  if (!canvas) throw new Error("Canvas not found");

  return prisma.user.findMany({
    where: { sharedCanvases: { some: { canvasId } } },
    select: { id: true, username: true, email: true },
  });
};

export const addCanvasMember = async ({
  canvasId,
  memberId,
  ownerId,
}: {
  canvasId: string;
  memberId: string;
  ownerId: string;
}) => {
  try {
    if (memberId === ownerId)
      throw new Error("Cannot share canvas with yourself");

    const canvas = await prisma.canvas.findUnique({
      where: { id: canvasId, userId: ownerId },
    });

    if (!canvas) throw new Error("Canvas not found");

    const created = await prisma.canvasPermission.create({
      data: { userId: memberId, canvasId },
      select: { user: { select: { id: true, username: true, email: true } } },
    });

    return created.user;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("User is already a member");
      }
    }

    throw error;
  }
};

export const removeCanvasMember = async ({
  canvasId,
  memberId,
  ownerId,
}: {
  canvasId: string;
  memberId: string;
  ownerId: string;
}) => {
  const canvas = await prisma.canvas.findUnique({
    where: { id: canvasId, userId: ownerId },
  });

  if (!canvas) throw new Error("Canvas not found");

  await prisma.canvasPermission.delete({
    where: { userId_canvasId: { canvasId, userId: memberId } },
  });
};
