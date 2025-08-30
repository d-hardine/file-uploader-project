/*
  Warnings:

  - You are about to drop the column `folderIdBefore` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Folder" DROP COLUMN "folderIdBefore",
ADD COLUMN     "folderIdAfter" INTEGER;
