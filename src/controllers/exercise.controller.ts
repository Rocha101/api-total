import { Request, Response, NextFunction } from "express";
import { ExerciseType, MuscleGroup, SetType } from "@prisma/client";
import { z } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

// Define Zod schema for request body validation
const exerciseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.nativeEnum(ExerciseType).optional(),
  muscleGroup: z.nativeEnum(MuscleGroup).optional(),
  equipment: z.string().optional(),
  accountId: z.string().optional(),
  sets: z.array(
    z.object({
      id: z.string().optional(),
      quantity: z.number().int(),
      weight: z.number().optional(),
      setType: z.nativeEnum(SetType).optional(),
    })
  ),
});

export const getAllExercises = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const exercises = await prisma.exercise.findMany({
      where: { accountId },
      include: {
        sets: {
          include: {
            reps: true,
          },
        },
      },
    });
    return ApiResponse.success(res, exercises);
  } catch (error) {
    next(error);
  }
};

export const getExerciseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const exercise = await prisma.exercise.findUnique({
      where: { id },
      include: {
        sets: {
          include: {
            reps: true,
          },
        },
        trains: true,
        account: true,
      },
    });

    if (!exercise) {
      throw new AppError("Exercise not found", 404);
    }

    return ApiResponse.success(res, exercise);
  } catch (error) {
    next(error);
  }
};

const deleteRepsAndSets = async (exerciseId: string) => {
  const sets = await prisma.sets.findMany({
    where: { exerciseId },
    include: { reps: true },
  });

  for (const set of sets) {
    await prisma.reps.deleteMany({
      where: { setsId: set.id },
    });
  }

  await prisma.sets.deleteMany({
    where: { exerciseId },
  });
};

export const createExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const exerciseData = exerciseSchema.parse(req.body);

    const exercise = await prisma.exercise.create({
      data: {
        name: exerciseData.name,
        description: exerciseData.description,
        type: exerciseData.type as ExerciseType,
        muscleGroup: exerciseData.muscleGroup as MuscleGroup,
        equipment: exerciseData.equipment,
        accountId: accountId as string,
        sets: {
          create: exerciseData.sets.map((rep) => ({
            reps: {
              create: rep,
            },
          })),
        },
      },
      include: { sets: { include: { reps: true } } },
    });

    return ApiResponse.created(res, exercise);
  } catch (error) {
    next(error);
  }
};

export const updateExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const exerciseData = exerciseSchema.parse(req.body);

    await deleteRepsAndSets(id);

    const exercise = await prisma.exercise.update({
      where: { id },
      data: {
        name: exerciseData.name,
        description: exerciseData.description,
        type: exerciseData.type as ExerciseType,
        muscleGroup: exerciseData.muscleGroup as MuscleGroup,
        equipment: exerciseData.equipment,
        accountId: accountId as string,
        sets: {
          create: exerciseData.sets.map((rep) => ({
            reps: {
              create: rep,
            },
          })),
        },
      },
      include: { sets: { include: { reps: true } } },
    });

    return ApiResponse.success(res, exercise, "Exercise updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteExercise = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await deleteRepsAndSets(id);
    await prisma.exercise.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Exercise deleted successfully");
  } catch (error) {
    next(error);
  }
};

export default {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
};
