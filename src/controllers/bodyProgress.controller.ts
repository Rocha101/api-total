import { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { object, string, number, array, enum as zodEnum, nativeEnum } from "zod";
import { ImageType } from "@prisma/client";
import { getAccountId } from "../utils/getAccountId";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

const createBodyProgressSchema = object({
  weight: number(),
  height: number(),
  bodyFat: number().optional(),
  notes: string().optional(),
  measurements: object({
    chest: number().optional(),
    waist: number().optional(),
    hips: number().optional(),
    bicepsLeft: number().optional(),
    bicepsRight: number().optional(),
    thighLeft: number().optional(),
    thighRight: number().optional(),
    calfLeft: number().optional(),
    calfRight: number().optional(),
  }).optional(),
  images: array(object({
    url: string().url(),
    type: nativeEnum(ImageType)
  })).optional(),
});

export const createBodyProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createBodyProgressSchema.parse(req.body);
    const { measurements, images, ...progressData } = validatedData; 
    const accountId = await getAccountId(req, res);

    const bodyProgress = await prisma.bodyProgress.create({
      data: {
        ...progressData,
        accountId: accountId as string,
        measurements: measurements ? {
          create: measurements
        } : undefined,
        images: images ? {
          create: images
        } : undefined
      },
      include: {
        measurements: true,
        images: true
      }
    });

    return ApiResponse.success(res, bodyProgress);
  } catch (error) {
    next(error);
  }
};

export const getBodyProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const bodyProgress = await prisma.bodyProgress.findMany({
      where: {
        accountId: accountId as string
      },
      include: {
        measurements: true,
        images: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return ApiResponse.success(res, bodyProgress);
  } catch (error) {
    next(error);
  }
};

export const getBodyProgressById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const bodyProgress = await prisma.bodyProgress.findUnique({
      where: {
        id,
        accountId: accountId as string
      },
      include: {
        measurements: true,
        images: true
      }
    });

    if (!bodyProgress) {
      throw new AppError("Registro de progresso não encontrado", 404);
    }

    return ApiResponse.success(res, bodyProgress);
  } catch (error) {
    next(error);
  }
};

export const updateBodyProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = createBodyProgressSchema.partial().parse(req.body);
    const { measurements, images, ...progressData } = validatedData;
    const accountId = await getAccountId(req, res);

    const bodyProgress = await prisma.bodyProgress.update({
      where: {
        id,
        accountId: accountId as string
      },
      data: {
        ...progressData,
        measurements: measurements ? {
          update: measurements
        } : undefined,
        images: images ? {
          deleteMany: {},
          create: images
        } : undefined
      },
      include: {
        measurements: true,
        images: true
      }
    });

    return ApiResponse.success(res, bodyProgress);
  } catch (error) {
    next(error);
  }
};

export const deleteBodyProgress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);

    await prisma.bodyProgress.delete({
      where: {
        id,
        accountId: accountId as string
      }
    });

    return ApiResponse.success(res, { message: "Registro de progresso deletado com sucesso" });
  } catch (error) {
    next(error);
  }
};

export default {
  createBodyProgress,
  getBodyProgress,
  getBodyProgressById,
  updateBodyProgress,
  deleteBodyProgress
};
