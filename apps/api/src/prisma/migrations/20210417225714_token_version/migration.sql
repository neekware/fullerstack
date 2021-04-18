/*
  Warnings:

  - You are about to drop the column `tokenCount` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "tokenCount",
ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 1;
