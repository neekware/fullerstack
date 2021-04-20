/*
  Warnings:

  - You are about to drop the column `permission` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "permission",
ADD COLUMN     "permissions" "Permission"[];
