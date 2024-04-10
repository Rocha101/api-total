-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('WARM_UP', 'WORKING', 'FEEDER', 'TOP', 'BACK_OFF');

-- AlterTable
ALTER TABLE "Reps" ADD COLUMN     "setType" "SetType";
