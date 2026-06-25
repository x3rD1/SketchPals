/*
  Warnings:

  - Added the required column `thumbnailPublicId` to the `canvas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `canvas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "canvas" ADD COLUMN     "thumbnailPublicId" TEXT NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;
