import { AppError } from "../../errors/appError";
import { prisma } from "../../lib/prisma";
import { StrokeInput } from "./canvas.types";

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
    data: {},
    include: { strokes: true },
  });

  return canvas;
};

export const updateCanvas = async ({
  id,
  strokes,
  version,
}: {
  id: string;
  strokes: StrokeInput[];
  version: number;
}) =>
  await prisma.$transaction(async (tx) => {
    const canvas = await tx.canvas.findUnique({ where: { id } });
    if (!canvas)
      throw new AppError("Canvas not found", 404, "CANVAS_NOT_FOUND");

    if (canvas.version !== version)
      throw new AppError(
        "Canvas version conflict",
        400,
        "CANVAS_VERSION_CONFLICT",
      );

    // Get all strokes by canvas id
    const existingStrokes = await tx.stroke.findMany({
      where: { canvasId: id },
    });

    // Create a fast lookup map for each existing stroke in DB
    const existingMap = new Map(existingStrokes.map((s) => [s.id, s]));

    // Create or Update a stroke
    for (const stroke of strokes) {
      if (existingMap.has(stroke.id)) {
        await tx.stroke.update({
          where: { id: stroke.id },
          data: {
            points: stroke.points,
            width: stroke.width,
            color: stroke.color,
          },
        });
      } else {
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

    // Delete existing strokes that belongs to canvasId and are not in the input strokes
    await tx.stroke.deleteMany({
      where: { canvasId: id, id: { notIn: strokes.map((s) => s.id) } },
    });

    return tx.canvas.update({
      where: { id },
      data: { version: { increment: 1 } },
      include: { strokes: true },
    });
  });
