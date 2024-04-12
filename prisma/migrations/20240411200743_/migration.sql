/*
  Warnings:

  - You are about to drop the column `weekDay` on the `Train` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Train" DROP COLUMN "weekDay",
ADD COLUMN     "weekDays" "WeekDay"[];
