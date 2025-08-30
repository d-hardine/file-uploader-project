/*
  Warnings:

  - You are about to drop the column `folderBefore` on the `Folder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Folder" DROP COLUMN "folderBefore",
ADD COLUMN     "folderIdBefore" INTEGER;
