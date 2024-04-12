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
  totalTime: z.number().int(),
  type: z.nativeEnum(ExerciseType).optional(),
  muscleGroup: z.nativeEnum(MuscleGroup).optional(),
  equipment: z.string().optional(),
  difficulty: z.number().int().min(1).max(10).default(1),
  imageUrl: z.string().optional(),
  accountId: z.string(),
  sets: z.array(
    z.object({
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
        accountId,
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
    const body = { ...req.body, accountId };
    const exerciseData = exerciseSchema.parse(body);

    // Create Exercise
    const exercise = await prisma.exercise.create({
      data: {
        name: exerciseData.name,
        description: exerciseData.description,
        totalTime: exerciseData.totalTime,
        type: exerciseData.type as any,
        muscleGroup: exerciseData.muscleGroup as any,
        equipment: exerciseData.equipment,
        difficulty: exerciseData.difficulty,
        imageUrl: exerciseData.imageUrl,
        account: { connect: { id: exerciseData.accountId } },
        sets: { create: [] },
      },
    });

    const sets = await prisma.sets.create({
      data: {
        exercise: { connect: { id: exercise.id } },
        reps: {
          create: exerciseData.sets.map((set: any) => ({
            quantity: set.quantity,
            weight: set.weight,
            setType: set.setType,
          })),
        },
      },
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

// PUT /exercises/:id
const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const body = { ...req.body, accountId };
    const exerciseData = exerciseSchema.parse(body);

    const exercise = await prisma.exercise.update({
      where: {
        id,
      },
      data: {
        name: exerciseData.name,
        description: exerciseData.description,
        totalTime: exerciseData.totalTime,
        type: exerciseData.type as any,
        muscleGroup: exerciseData.muscleGroup as any,
        equipment: exerciseData.equipment,
        difficulty: exerciseData.difficulty,
        imageUrl: exerciseData.imageUrl,
        account: { connect: { id: exerciseData.accountId } },
        sets: {
          create: exerciseData.sets.map((set: any) => ({
            reps: {
              create: set.reps.map((rep: any) => ({
                quantity: rep.quantity,
                weight: rep.weight,
                setType: rep.setType,
              })),
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
    console.log(error);
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
