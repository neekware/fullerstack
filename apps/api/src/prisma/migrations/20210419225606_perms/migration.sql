/*
  Warnings:

  - The `permission` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('groupCREATE', 'groupREAD', 'groupUPDATE', 'groupDELETE', 'groupALL', 'userCREATE', 'userREAD', 'userUPDATE', 'userDELETE', 'userALL');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permission",
ADD COLUMN     "permission" "Permission"[];

-- DropEnum
DROP TYPE "UserPermission";
