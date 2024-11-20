-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('FRONT', 'BACK', 'SIDE_LEFT', 'SIDE_RIGHT');

-- CreateTable
CREATE TABLE "BodyProgress" (
    "id" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "bodyFat" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "BodyProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measurements" (
    "id" TEXT NOT NULL,
    "chest" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hips" DOUBLE PRECISION,
    "bicepsLeft" DOUBLE PRECISION,
    "bicepsRight" DOUBLE PRECISION,
    "thighLeft" DOUBLE PRECISION,
    "thighRight" DOUBLE PRECISION,
    "calfLeft" DOUBLE PRECISION,
    "calfRight" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bodyProgressId" TEXT NOT NULL,

    CONSTRAINT "Measurements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ImageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bodyProgressId" TEXT NOT NULL,

    CONSTRAINT "ProgressImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Measurements_bodyProgressId_key" ON "Measurements"("bodyProgressId");

-- AddForeignKey
ALTER TABLE "BodyProgress" ADD CONSTRAINT "BodyProgress_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measurements" ADD CONSTRAINT "Measurements_bodyProgressId_fkey" FOREIGN KEY ("bodyProgressId") REFERENCES "BodyProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressImage" ADD CONSTRAINT "ProgressImage_bodyProgressId_fkey" FOREIGN KEY ("bodyProgressId") REFERENCES "BodyProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
