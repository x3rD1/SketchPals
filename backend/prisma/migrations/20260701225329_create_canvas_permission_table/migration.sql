-- CreateTable
CREATE TABLE "canvasPermissions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "canvasId" TEXT NOT NULL,

    CONSTRAINT "canvasPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "canvasPermissions_userId_canvasId_key" ON "canvasPermissions"("userId", "canvasId");

-- AddForeignKey
ALTER TABLE "canvasPermissions" ADD CONSTRAINT "canvasPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvasPermissions" ADD CONSTRAINT "canvasPermissions_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "canvas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
