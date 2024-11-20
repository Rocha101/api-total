-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('COACH', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('CARDIO', 'STRETCHING', 'STRENGHT');

-- CreateEnum
CREATE TYPE "SetType" AS ENUM ('WARM_UP', 'WORKING', 'FEEDER', 'TOP', 'BACK_OFF');

-- CreateEnum
CREATE TYPE "MuscleGroup" AS ENUM ('CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'CALVES', 'ABS', 'QUADS', 'HAMSTRINGS', 'GLUTES', 'ADDUCTORS', 'ABDUCTORS', 'TRAPS', 'LATS', 'LOWER_BACK', 'OBLIQUES', 'NECK');

-- CreateEnum
CREATE TYPE "MealUnit" AS ENUM ('GR', 'ML', 'UNIT');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER');

-- CreateEnum
CREATE TYPE "HormoneType" AS ENUM ('NINETEEN_NOR', 'DHT', 'TESTOSTERONE', 'PEPTIDE', 'INSULIN', 'TIREOID');

-- CreateEnum
CREATE TYPE "HormoneUnit" AS ENUM ('MG', 'ML', 'UI', 'UNIT');

-- CreateEnum
CREATE TYPE "ConcentrationUnit" AS ENUM ('MG_ML', 'MG');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coachId" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,
    "expiresAt" TIMESTAMP(3),
    "planId" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Train" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weekDays" "WeekDay"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Train_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reps" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "setType" "SetType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "setsId" TEXT NOT NULL,

    CONSTRAINT "Reps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sets" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "Sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ExerciseType" DEFAULT 'STRENGHT',
    "muscleGroup" "MuscleGroup",
    "equipment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Diet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "mealType" "MealType" NOT NULL,
    "totalCalories" DOUBLE PRECISION,
    "totalProteins" DOUBLE PRECISION,
    "totalCarbs" DOUBLE PRECISION,
    "totalFats" DOUBLE PRECISION,
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION,
    "unit" "MealUnit",
    "calories" DOUBLE PRECISION,
    "proteins" DOUBLE PRECISION,
    "carbs" DOUBLE PRECISION,
    "fats" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hormone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "concentration" DOUBLE PRECISION,
    "unit" "HormoneUnit" NOT NULL,
    "concentrationUnit" "ConcentrationUnit",
    "hormoneType" "HormoneType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "Hormone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExtraCompounds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "concentration" DOUBLE PRECISION,
    "unit" "HormoneUnit" NOT NULL,
    "concentrationUnit" "ConcentrationUnit",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "ExtraCompounds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HormonalProtocol" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "HormonalProtocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Protocol" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "accountId" TEXT,
    "clientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExerciseToTrain" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DietToMeal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DietToProtocol" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_FoodToMeal" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ExtraCompoundsToProtocol" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_HormonalProtocolToHormone" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_HormonalProtocolToProtocol" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProtocolToTrain" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_ExerciseToTrain_AB_unique" ON "_ExerciseToTrain"("A", "B");

-- CreateIndex
CREATE INDEX "_ExerciseToTrain_B_index" ON "_ExerciseToTrain"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DietToMeal_AB_unique" ON "_DietToMeal"("A", "B");

-- CreateIndex
CREATE INDEX "_DietToMeal_B_index" ON "_DietToMeal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DietToProtocol_AB_unique" ON "_DietToProtocol"("A", "B");

-- CreateIndex
CREATE INDEX "_DietToProtocol_B_index" ON "_DietToProtocol"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToMeal_AB_unique" ON "_FoodToMeal"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToMeal_B_index" ON "_FoodToMeal"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ExtraCompoundsToProtocol_AB_unique" ON "_ExtraCompoundsToProtocol"("A", "B");

-- CreateIndex
CREATE INDEX "_ExtraCompoundsToProtocol_B_index" ON "_ExtraCompoundsToProtocol"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HormonalProtocolToHormone_AB_unique" ON "_HormonalProtocolToHormone"("A", "B");

-- CreateIndex
CREATE INDEX "_HormonalProtocolToHormone_B_index" ON "_HormonalProtocolToHormone"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HormonalProtocolToProtocol_AB_unique" ON "_HormonalProtocolToProtocol"("A", "B");

-- CreateIndex
CREATE INDEX "_HormonalProtocolToProtocol_B_index" ON "_HormonalProtocolToProtocol"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProtocolToTrain_AB_unique" ON "_ProtocolToTrain"("A", "B");

-- CreateIndex
CREATE INDEX "_ProtocolToTrain_B_index" ON "_ProtocolToTrain"("B");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Train" ADD CONSTRAINT "Train_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reps" ADD CONSTRAINT "Reps_setsId_fkey" FOREIGN KEY ("setsId") REFERENCES "Sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sets" ADD CONSTRAINT "Sets_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diet" ADD CONSTRAINT "Diet_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meal" ADD CONSTRAINT "Meal_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hormone" ADD CONSTRAINT "Hormone_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExtraCompounds" ADD CONSTRAINT "ExtraCompounds_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HormonalProtocol" ADD CONSTRAINT "HormonalProtocol_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol" ADD CONSTRAINT "Protocol_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToTrain" ADD CONSTRAINT "_ExerciseToTrain_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExerciseToTrain" ADD CONSTRAINT "_ExerciseToTrain_B_fkey" FOREIGN KEY ("B") REFERENCES "Train"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DietToMeal" ADD CONSTRAINT "_DietToMeal_A_fkey" FOREIGN KEY ("A") REFERENCES "Diet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DietToMeal" ADD CONSTRAINT "_DietToMeal_B_fkey" FOREIGN KEY ("B") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DietToProtocol" ADD CONSTRAINT "_DietToProtocol_A_fkey" FOREIGN KEY ("A") REFERENCES "Diet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DietToProtocol" ADD CONSTRAINT "_DietToProtocol_B_fkey" FOREIGN KEY ("B") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToMeal" ADD CONSTRAINT "_FoodToMeal_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToMeal" ADD CONSTRAINT "_FoodToMeal_B_fkey" FOREIGN KEY ("B") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraCompoundsToProtocol" ADD CONSTRAINT "_ExtraCompoundsToProtocol_A_fkey" FOREIGN KEY ("A") REFERENCES "ExtraCompounds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExtraCompoundsToProtocol" ADD CONSTRAINT "_ExtraCompoundsToProtocol_B_fkey" FOREIGN KEY ("B") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HormonalProtocolToHormone" ADD CONSTRAINT "_HormonalProtocolToHormone_A_fkey" FOREIGN KEY ("A") REFERENCES "HormonalProtocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HormonalProtocolToHormone" ADD CONSTRAINT "_HormonalProtocolToHormone_B_fkey" FOREIGN KEY ("B") REFERENCES "Hormone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HormonalProtocolToProtocol" ADD CONSTRAINT "_HormonalProtocolToProtocol_A_fkey" FOREIGN KEY ("A") REFERENCES "HormonalProtocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HormonalProtocolToProtocol" ADD CONSTRAINT "_HormonalProtocolToProtocol_B_fkey" FOREIGN KEY ("B") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProtocolToTrain" ADD CONSTRAINT "_ProtocolToTrain_A_fkey" FOREIGN KEY ("A") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProtocolToTrain" ADD CONSTRAINT "_ProtocolToTrain_B_fkey" FOREIGN KEY ("B") REFERENCES "Train"("id") ON DELETE CASCADE ON UPDATE CASCADE;
