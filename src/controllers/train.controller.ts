import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { nativeEnum, object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { WeekDay } from "@prisma/client";

const prisma = new PrismaClient();

// Zod schema for validating the request body when creating or updating a train
const trainSchema = object({
  name: string(),
  description: string().optional(),
  exercises: string().array(),
  weekDays: nativeEnum(WeekDay).array().optional(),
  accountId: string(),
  protocolId: string().optional(),
});

// GET /trains
const getAllTrains = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const trains = await prisma.train.findMany({
      where: {
        accountId,
      },
      include: {
        exercises: {
          include: {
            sets: {
              include: {
                reps: true,
              },
            },
          },
        },
      },
    });
    res.json(trains);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /trains/:id
const getTrainById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const train = await prisma.train.findUnique({
      where: {
        id,
      },
      include: {
        exercises: {
          include: {
            sets: {
              include: {
                reps: true,
              },
            },
          },
        },
      },
    });

    if (!train) {
      res.status(404).json({ error: "Train not found" });
    } else {
      res.json(train);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getTrainByProtocolId = async (req: Request, res: Response) => {
  const { protocolId } = req.params;
  try {
    const train = await prisma.train.findMany({
      where: {
        protocolId,
      },
      include: {
        exercises: {
          include: {
            sets: {
              include: {
                reps: true,
              },
            },
          },
        },
      },
    });

    if (!train) {
      res.status(404).json({ error: "Train not found" });
    } else {
      res.json(train);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /trains
const createTrain = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      account: {
        id: accountId,
      },
      accountId,
    };
    const validatedData = trainSchema.parse(body);
    const train = await prisma.train.create({
      data: {
        ...validatedData,
        exercises: {
          connect: validatedData.exercises.map((exerciseId: string) => ({
            id: exerciseId,
          })),
        },
      },
    });
    res.status(201).json(train);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /trains/:id
const updateTrain = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      account: {
        id: accountId,
      },
      accountId,
    };
    const validatedData = trainSchema.parse(body);

    const updatedTrain = await prisma.train.update({
      where: {
        id,
      },
      data: {
        ...validatedData,
        exercises: {
          set: validatedData.exercises.map((exerciseId: string) => ({
            id: exerciseId,
          })),
        },
      },
    });
    res.json(updatedTrain);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /trains/:id
const deleteTrain = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.train.delete({
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
  getAllTrains,
  getTrainById,
  createTrain,
  updateTrain,
  deleteTrain,
  getTrainByProtocolId,
};
