/*
  Warnings:

  - Added the required column `thumbnail` to the `canvas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `canvas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "canvas" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
