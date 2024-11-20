import { Request, Response, NextFunction } from "express";
import { object, string, number, enum as enumValidator } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

// Zod schema for validating the request body when creating or updating a food
const foodSchema = object({
  name: string(),
  description: string().optional(),
  quantity: number().optional(),
  unit: enumValidator(["GR", "ML", "UNIT"]).optional(),
  calories: number().optional(),
  proteins: number().optional(),
  carbs: number().optional(),
  fats: number().optional(),
  mealId: string().optional(),
  accountId: string().optional(),
});

export const getAllFoods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const foods = await prisma.food.findMany({
      where: { accountId },
    });
    return ApiResponse.success(res, foods);
  } catch (error) {
    next(error);
  }
};

export const getFoodById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const food = await prisma.food.findUnique({
      where: { id },
    });

    if (!food) {
      throw new AppError("Food not found", 404);
    }

    return ApiResponse.success(res, food);
  } catch (error) {
    next(error);
  }
};

export const createFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = foodSchema.parse(req.body);

    const food = await prisma.food.create({
      data: {
        ...validatedData,
        accountId: accountId as string,
      },
    });

    return ApiResponse.created(res, food);
  } catch (error) {
    next(error);
  }
};

export const updateFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const validatedData = foodSchema.parse(req.body);

    const food = await prisma.food.update({
      where: { id },
      data: {
        ...validatedData,
        accountId: accountId as string,
      },
    });

    return ApiResponse.success(res, food, "Food updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteFood = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.food.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Food deleted successfully");
  } catch (error) {
    next(error);
  }
};

export default {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
