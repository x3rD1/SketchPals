/*
  Warnings:

  - The `points` column on the `strokes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "strokes" DROP COLUMN "points",
ADD COLUMN     "points" INTEGER[];
