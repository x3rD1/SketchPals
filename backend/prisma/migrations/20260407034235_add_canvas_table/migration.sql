/*
  Warnings:

  - Added the required column `canvasId` to the `strokes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "strokes" ADD COLUMN     "canvasId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "canvas" (
    "id" TEXT NOT NULL,

    CONSTRAINT "canvas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "strokes" ADD CONSTRAINT "strokes_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
