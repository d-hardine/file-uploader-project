/*
  Warnings:

  - You are about to drop the column `FileSize` on the `Storage` table. All the data in the column will be lost.
  - Added the required column `fileSize` to the `Storage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Storage" DROP COLUMN "FileSize",
ADD COLUMN     "fileSize" INTEGER NOT NULL;
