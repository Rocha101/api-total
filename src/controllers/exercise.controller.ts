import { Request, Response } from "express";
import {
  ExerciseType,
  MuscleGroup,
  PrismaClient,
  SetType,
} from "@prisma/client";
import { z } from "zod";
import { getAccountId } from "../utils/getAccountId";

const prisma = new PrismaClient();
// Define Zod schema for request body validation
const exerciseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.nativeEnum(ExerciseType).optional(),
  muscleGroup: z.nativeEnum(MuscleGroup).optional(),
  equipment: z.string().optional(),
  accountId: z.string(),
  sets: z.array(
    z.object({
      id: z.string().optional(),
      quantity: z.number().int(),
      weight: z.number().optional(),
      setType: z.nativeEnum(SetType).optional(),
    })
  ),
});

// GET /exercises
const getAllExercises = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const exercises = await prisma.exercise.findMany({
      where: {
        account: {
          id: accountId,
        },
      },
      include: {
        sets: {
          include: {
            reps: true,
          },
        },
        train: true,
        account: true,
      },
    });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /exercises/:id
const getExerciseById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const exercise = await prisma.exercise.findUnique({
      where: {
        id,
      },
      include: {
        sets: {
          include: {
            reps: true,
          },
        },
        train: true,
        account: true,
      },
    });
    if (!exercise) {
      res.status(404).json({ error: "Exercise not found" });
    } else {
      res.json(exercise);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /exercises
const createExercise = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const exerciseData = exerciseSchema.parse(req.body);

    // Create Exercise
    const exercise = await prisma.exercise.create({
      data: {
        name: exerciseData.name,
        description: exerciseData.description,
        type: exerciseData.type as any,
        muscleGroup: exerciseData.muscleGroup as any,
        equipment: exerciseData.equipment,
        account: { connect: { id: exerciseData.accountId } },
        sets: {
          create: exerciseData.sets.map((set: any) => ({
            reps: {
              create: set,
            },
          })),
        },
      },
      include: { sets: { include: { reps: true } } },
    });

    res.json(exercise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error);
      res
        .status(400)
        .json({ error: "Validation Error", details: error.errors });
    } else {
      console.error("Error creating Exercise:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const deleteRepsAndSets = async (exerciseId: string) => {
  await prisma.reps.deleteMany({
    where: { sets: { exerciseId } },
  });

  await prisma.sets.deleteMany({
    where: { exerciseId },
  });
};

// PUT /exercises/:id
const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const exerciseData = exerciseSchema.parse(req.body);

    await deleteRepsAndSets(id);

    const exercise = await prisma.exercise.update({
      where: {
        id,
      },
      data: {
        name: exerciseData.name,
        description: exerciseData.description,
        type: exerciseData.type as any,
        muscleGroup: exerciseData.muscleGroup as any,
        equipment: exerciseData.equipment,
        account: { connect: { id: exerciseData.accountId } },
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

    res.json(exercise);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:", error);
      res
        .status(400)
        .json({ error: "Validation Error", details: error.errors });
    } else {
      console.error("Error creating Exercise:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// DELETE /exercises/:id
const deleteExercise = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.reps.deleteMany({
      where: {
        sets: {
          exerciseId: id,
        },
      },
    });
    await prisma.sets.deleteMany({
      where: {
        exerciseId: id,
      },
    });
    await prisma.exercise.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
};
