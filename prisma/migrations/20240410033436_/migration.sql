/*
  Warnings:

  - Added the required column `name` to the `HormonalProtocol` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HormonalProtocol" ADD COLUMN     "name" TEXT NOT NULL;
