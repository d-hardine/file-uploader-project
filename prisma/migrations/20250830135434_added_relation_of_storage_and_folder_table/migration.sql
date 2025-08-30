/*
  Warnings:

  - Added the required column `folderId` to the `Storage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Storage" ADD COLUMN     "folderId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Storage" ADD CONSTRAINT "Storage_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "public"."Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
