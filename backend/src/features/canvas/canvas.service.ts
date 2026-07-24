import cloudinary from "../../config/cloudinary";
import { AppError } from "../../errors/appError";
import { prisma, Prisma } from "../../lib/prisma";
import { uploadThumbnail } from "../../lib/uploadThumbnail";
import { CanvasOp } from "./canvas.types";

type DbClient = typeof prisma | Prisma.TransactionClient;

export const requireCanvasAccess = async (
  db: DbClient,
  canvasId: string,
  userId: string,
) => {
  const canvas = await db.canvas.findFirst({
    where: {
      id: canvasId,
      OR: [{ userId }, { sharedWith: { some: { userId } } }],
    },
    include: { strokes: true },
  });

  if (!canvas) throw new Error("Canvas not found");

  return canvas;
};

export const getCanvasById = async (id: string, userId: string) => {
  const canvas = await requireCanvasAccess(prisma, id, userId);

  const canManage = canvas.userId === userId;

  return { ...canvas, canManage };
};

export const createCanvas = async (userId: string) => {
  const canvas = await prisma.canvas.create({
    data: {
      userId,
      title: "Untitled",
      thumbnail: "https://placehold.co/500x500",
    },
    select: { id: true },
  });

  return canvas;
};

export const updateCanvas = async ({
  canvasId,
  ops,
  version,
  buffer,
  userId,
}: {
  canvasId: string;
  ops: CanvasOp[];
  version: number;
  buffer: Buffer;
  userId: string;
}) => {
  const uploadResult = await uploadThumbnail(buffer);

  try {
    let oldThumbnailPublicId;

    const result = await prisma.$transaction(async (tx) => {
      if (!ops.length) throw new Error("No operations to be saved");

      // Check whether the userId has access to canvasId
      const canvas = await requireCanvasAccess(tx, canvasId, userId);

      oldThumbnailPublicId = canvas.thumbnailPublicId;

      const updateResult = await tx.canvas.updateMany({
        where: { id: canvasId, version },
        data: {
          version: { increment: 1 },
          thumbnail: uploadResult.secure_url,
          thumbnailPublicId: uploadResult.public_id,
        },
      });

      if (!updateResult.count) {
        console.error("CANVAS_VERSION_CONFLICT");
        throw new Error("A newer save already exists.");
      }

      for (const op of ops) {
        if (op.type === "add") {
          for (const stroke of op.strokes) {
            await tx.stroke.create({
              data: {
                id: stroke.id,
                points: stroke.points,
                width: stroke.width,
                color: stroke.color,
                canvasId,
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

      const updatedCanvas = await tx.canvas.findUnique({
        where: { id: canvasId },
        include: { strokes: true },
      });

      if (!updatedCanvas) throw new Error("Canvas does not exists");

      const canManage = updatedCanvas.userId === userId;

      return { ...updatedCanvas, canManage };
    });

    if (oldThumbnailPublicId)
      await cloudinary.uploader.destroy(oldThumbnailPublicId);

    return result;
  } catch (error) {
    if (uploadResult.public_id) {
      await cloudinary.uploader.destroy(uploadResult.public_id);
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.error(error.message);
        throw new Error("A newer save already exists.");
      }
    }

    throw error;
  }
};

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
