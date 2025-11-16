/*
  Warnings:

  - The values [KONSUMEN] on the enum `Kualitas` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Kualitas_new" AS ENUM ('GOOD', 'MODERATE', 'POOR');
ALTER TABLE "Laporan" ALTER COLUMN "status" TYPE "Kualitas_new" USING ("status"::text::"Kualitas_new");
ALTER TYPE "Kualitas" RENAME TO "Kualitas_old";
ALTER TYPE "Kualitas_new" RENAME TO "Kualitas";
DROP TYPE "public"."Kualitas_old";
COMMIT;
