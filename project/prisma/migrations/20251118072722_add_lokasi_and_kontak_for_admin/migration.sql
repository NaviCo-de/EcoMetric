/*
  Warnings:

  - You are about to drop the `RantaiPasok` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `kontak` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lokasi` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RantaiPasok" DROP CONSTRAINT "RantaiPasok_pabrikRelasi1Id_fkey";

-- DropForeignKey
ALTER TABLE "RantaiPasok" DROP CONSTRAINT "RantaiPasok_pabrikRelasi2Id_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "kontak" TEXT NOT NULL,
ADD COLUMN     "lokasi" TEXT NOT NULL,
ADD COLUMN     "rantaiId" TEXT;

-- DropTable
DROP TABLE "RantaiPasok";

-- CreateTable
CREATE TABLE "Rantai" (
    "id" TEXT NOT NULL,
    "nama" TEXT,

    CONSTRAINT "Rantai_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_rantaiId_fkey" FOREIGN KEY ("rantaiId") REFERENCES "Rantai"("id") ON DELETE SET NULL ON UPDATE CASCADE;
