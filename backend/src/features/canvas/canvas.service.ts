import cloudinary from "../../config/cloudinary";
import { AppError } from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import { uploadThumbnail } from "../../lib/uploadThumbnail";
import { CanvasOp } from "./canvas.types";

export const getCanvasById = async (id: string) => {
  const canvas = await prisma.canvas.findUnique({
    where: { id },
    include: { strokes: true },
  });

  if (!canvas) throw new AppError("Canvas not found", 404, "CANVAS_NOT_FOUND");

  return canvas;
};

export const createCanvas = async () => {
  const canvas = await prisma.canvas.create({
    data: { title: "Untitled", thumbnail: "https://placehold.co/500x500" },
    include: { strokes: true },
  });

  return canvas;
};

export const updateCanvas = async ({
  id,
  ops,
  version,
  file,
}: {
  id: string;
  ops: CanvasOp[];
  version: number;
  file: Express.Multer.File;
}) =>
  await prisma.$transaction(async (tx) => {
    if (ops.length > 0) {
      const canvas = await tx.canvas.findUnique({ where: { id } });
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
      where: { id },
      data: {
        version: { increment: 1 },
        thumbnail: uploadResult.secure_url,
        thumbnailPublicId: uploadResult.public_id,
      },
      include: { strokes: true },
    });
  });
