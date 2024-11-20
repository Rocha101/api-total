import { Request, Response, NextFunction } from "express";
import { nativeEnum, object, string, enum as zodEnum } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";
import { MealType } from "@prisma/client";

// Zod schema for validating the request body when creating or updating a meal
const mealSchema = object({
  name: string(),
  description: string().optional(),
  dietId: string().optional(),
  accountId: string().optional(),
  foods: string().array(),
  mealType: nativeEnum(MealType).optional(),
});

export const getAllMeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const meals = await prisma.meal.findMany({
      where: { accountId },
      include: {
        foods: true,
      },
    });
    return ApiResponse.success(res, meals);
  } catch (error) {
    next(error);
  }
};

export const getMealById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        foods: true,
      },
    });

    if (!meal) {
      throw new AppError("Meal not found", 404);
    }

    return ApiResponse.success(res, meal);
  } catch (error) {
    next(error);
  }
};

export const createMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = mealSchema.parse(req.body);

    const meal = await prisma.meal.create({
      data: {
        ...validatedData,
        accountId: accountId as string,
        mealType: validatedData.mealType,
        foods: {
          connect: validatedData.foods.map((foodId: string) => ({
            id: foodId,
          })),
        },
      },
      include: {
        foods: true,
      },
    });

    return ApiResponse.created(res, meal);
  } catch (error) {
    next(error);
  }
};

export const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const validatedData = mealSchema.parse(req.body);

    const meal = await prisma.meal.update({
      where: { id },
      data: {
        ...validatedData,
        accountId: accountId as string,
        mealType: validatedData.mealType,
        foods: {
          set: validatedData.foods.map((foodId: string) => ({
            id: foodId,
          })),
        },
      },
      include: {
        foods: true,
      },
    });

    return ApiResponse.success(res, meal, "Meal updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.meal.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Meal deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getMealByDietId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dietId } = req.params;
    const meals = await prisma.meal.findMany({
      where: {
        diets: {
          some: {
            id: dietId,
          },
        },
      },
      include: {
        foods: true,
      },
    });

    if (!meals) {
      throw new AppError("Meals not found", 404);
    }

    return ApiResponse.success(res, meals);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  getMealByDietId,
};
