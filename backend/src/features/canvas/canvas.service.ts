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
}: {
  id: string;
  strokes: StrokeInput[];
}) => {
  // Get all strokes by canvas id
  const existingStrokes = await prisma.stroke.findMany({
    where: { canvasId: id },
  });

  // Create a fast lookup map for each existing stroke in DB
  const existingMap = new Map(existingStrokes.map((s) => [s.id, s]));

  // Create or Update a stroke
  await prisma.$transaction(
    strokes.map((stroke) => {
      if (existingMap.has(stroke.id)) {
        return prisma.stroke.update({
          where: { id: stroke.id },
          data: { points: stroke.points },
        });
      } else {
        return prisma.stroke.create({
          data: { id: stroke.id, points: stroke.points, canvasId: id },
        });
      }
    }),
  );

  // Create a fast lookup set for incoming strokes by id
  const incomingStrokeIds = new Set(strokes.map((s) => s.id));

  const toDelete = existingStrokes.filter((s) => !incomingStrokeIds.has(s.id));

  await prisma.stroke.deleteMany({
    where: { id: { in: toDelete.map((s) => s.id) } },
  });

  return prisma.canvas.findUnique({
    where: { id },
    include: { strokes: true },
  });
};
