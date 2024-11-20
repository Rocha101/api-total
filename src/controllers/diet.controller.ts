import { Request, Response, NextFunction } from "express";
import { object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

// Zod schema for validating the request body when creating or updating a diet
const dietSchema = object({
  name: string(),
  description: string().optional(),
  protocolId: string().optional(),
  accountId: string().optional(),
  meals: string().array(),
});

export const getAllDiets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const diets = await prisma.diet.findMany({
      where: { accountId },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });
    return ApiResponse.success(res, diets);
  } catch (error) {
    next(error);
  }
};

export const getDietById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const diet = await prisma.diet.findUnique({
      where: { id },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });

    if (!diet) {
      throw new AppError("Diet not found", 404);
    }

    return ApiResponse.success(res, diet);
  } catch (error) {
    next(error);
  }
};

export const createDiet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = dietSchema.parse(req.body);

    const diet = await prisma.diet.create({
      data: {
        ...validatedData,
        accountId: accountId as string,
        meals: {
          connect: validatedData.meals.map((mealId: string) => ({
            id: mealId,
          })),
        },
      },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });

    return ApiResponse.created(res, diet);
  } catch (error) {
    next(error);
  }
};

export const updateDiet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = dietSchema.parse(req.body);
    const accountId = await getAccountId(req, res);

    const diet = await prisma.diet.update({
      where: { id },
      data: {
        ...validatedData,
        accountId: accountId as string,
        meals: {
          set: validatedData.meals.map((mealId: string) => ({
            id: mealId,
          })),
        },
      },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });

    return ApiResponse.success(res, diet, "Diet updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteDiet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.diet.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Diet deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getDietByProtocolId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { protocolId } = req.params;
    const diets = await prisma.diet.findMany({
      where: {
        protocols: {
          some: {
            id: protocolId,
          },
        },
      },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });

    if (!diets) {
      throw new AppError("Diet not found", 404);
    }

    return ApiResponse.success(res, diets);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllDiets,
  getDietById,
  createDiet,
  updateDiet,
  deleteDiet,
  getDietByProtocolId,
};
