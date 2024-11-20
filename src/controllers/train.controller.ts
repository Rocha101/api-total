import { Request, Response, NextFunction } from "express";
import { nativeEnum, object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { WeekDay } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

// Zod schema for validating the request body when creating or updating a train
const trainSchema = object({
  name: string(),
  description: string().optional(),
  exercises: string().array(),
  weekDays: nativeEnum(WeekDay).array().optional(),
  accountId: string().optional(),
  protocolId: string().optional(),
});

export const getAllTrains = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const trains = await prisma.train.findMany({
      where: { accountId },
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
    return ApiResponse.success(res, trains);
  } catch (error) {
    next(error);
  }
};

export const getTrainById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const train = await prisma.train.findUnique({
      where: { id },
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
      throw new AppError("Train not found", 404);
    }

    return ApiResponse.success(res, train);
  } catch (error) {
    next(error);
  }
};

export const createTrain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = trainSchema.parse(req.body);
    
    const train = await prisma.train.create({
      data: {
        ...validatedData,
        accountId: accountId as string,
        exercises: {
          connect: validatedData.exercises.map((exerciseId: string) => ({
            id: exerciseId,
          })),
        },
      },
    });

    return ApiResponse.created(res, train);
  } catch (error) {
    next(error);
  }
};

export const updateTrain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = trainSchema.parse(req.body);
    const accountId = await getAccountId(req, res);

    const train = await prisma.train.update({
      where: { id },
      data: {
        ...validatedData,
        accountId: accountId as string,
        exercises: {
          set: validatedData.exercises.map((exerciseId: string) => ({
            id: exerciseId,
          })),
        },
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

    return ApiResponse.success(res, train, "Train updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteTrain = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.train.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Train deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getTrainByProtocolId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { protocolId } = req.params;
    const train = await prisma.train.findMany({
      where: {
        protocols: {
          some: {
            id: protocolId,
          },
        },
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
      throw new AppError("Train not found", 404);
    }

    return ApiResponse.success(res, train);
  } catch (error) {
    next(error);
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
