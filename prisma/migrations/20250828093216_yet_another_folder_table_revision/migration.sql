/*
  Warnings:

  - The `folderIdAfter` column on the `Folder` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Folder" DROP COLUMN "folderIdAfter",
ADD COLUMN     "folderIdAfter" INTEGER[];
