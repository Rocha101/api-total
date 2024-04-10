-- CreateEnum
CREATE TYPE "ConcentrationUnit" AS ENUM ('MG_ML', 'MG');

-- AlterTable
ALTER TABLE "ExtraCompounds" ADD COLUMN     "concentrationUnit" "ConcentrationUnit";
