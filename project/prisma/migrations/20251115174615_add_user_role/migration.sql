-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPERADMIN');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';
