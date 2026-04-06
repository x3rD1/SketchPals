import { Stroke } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { StrokeInput } from "./stroke.types";

export const getAllStrokes = async (): Promise<Stroke[]> => {
  return prisma.stroke.findMany();
};

export const createStroke = async (points: StrokeInput): Promise<Stroke> => {
  return prisma.stroke.create({ data: { points } });
};
