/*
  Warnings:

  - You are about to drop the column `userId` on the `Storage` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Storage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `Storage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFileName` to the `Storage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Storage" DROP CONSTRAINT "Storage_userId_fkey";

-- DropIndex
DROP INDEX "public"."Storage_userId_key";

-- AlterTable
ALTER TABLE "public"."Storage" DROP COLUMN "userId",
ADD COLUMN     "authorId" INTEGER NOT NULL,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "originalFileName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Storage" ADD CONSTRAINT "Storage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
