/*
  Warnings:

  - Added the required column `folderIdBefore` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Folder" ADD COLUMN     "folderIdBefore" INTEGER NOT NULL;
