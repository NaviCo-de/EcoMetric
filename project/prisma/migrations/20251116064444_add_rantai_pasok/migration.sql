-- CreateEnum
CREATE TYPE "TipePabrik" AS ENUM ('PRODUSEN', 'DISTRIBUTOR', 'KONSUMEN');

-- CreateEnum
CREATE TYPE "Kualitas" AS ENUM ('GOOD', 'MODERATE', 'KONSUMEN');

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "tipePabrik" "TipePabrik" NOT NULL DEFAULT 'DISTRIBUTOR';

-- CreateTable
CREATE TABLE "Laporan" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "skor" INTEGER NOT NULL,
    "deskripsiAI" TEXT NOT NULL,
    "status" "Kualitas" NOT NULL,
    "pabrikId" TEXT NOT NULL,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RantaiPasok" (
    "id" TEXT NOT NULL,
    "pabrikRelasi1Id" TEXT NOT NULL,
    "pabrikRelasi2Id" TEXT NOT NULL,

    CONSTRAINT "RantaiPasok_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RantaiPasok_pabrikRelasi1Id_pabrikRelasi2Id_key" ON "RantaiPasok"("pabrikRelasi1Id", "pabrikRelasi2Id");

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_pabrikId_fkey" FOREIGN KEY ("pabrikId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RantaiPasok" ADD CONSTRAINT "RantaiPasok_pabrikRelasi1Id_fkey" FOREIGN KEY ("pabrikRelasi1Id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RantaiPasok" ADD CONSTRAINT "RantaiPasok_pabrikRelasi2Id_fkey" FOREIGN KEY ("pabrikRelasi2Id") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
