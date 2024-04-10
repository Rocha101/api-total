/*
  Warnings:

  - The values [AEROBIC,ANAEROBIC] on the enum `ExerciseType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExerciseType_new" AS ENUM ('CARDIO', 'STRETCHING', 'STRENGHT');
ALTER TABLE "Exercise" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Exercise" ALTER COLUMN "type" TYPE "ExerciseType_new" USING ("type"::text::"ExerciseType_new");
ALTER TYPE "ExerciseType" RENAME TO "ExerciseType_old";
ALTER TYPE "ExerciseType_new" RENAME TO "ExerciseType";
DROP TYPE "ExerciseType_old";
ALTER TABLE "Exercise" ALTER COLUMN "type" SET DEFAULT 'STRENGHT';
COMMIT;

-- AlterTable
ALTER TABLE "Exercise" ALTER COLUMN "type" SET DEFAULT 'STRENGHT';
