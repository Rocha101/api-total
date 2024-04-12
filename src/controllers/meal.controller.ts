import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string, number, enum as enumValidator } from "zod";
import { getAccountId } from "../utils/getAccountId";
import getPagination from "../utils/getPagination";

const prisma = new PrismaClient();

// Zod schema for validating the request body when creating or updating a meal
const mealSchema = object({
  name: string(),
  description: string().optional(),
  mealType: enumValidator([
    "BREAKFAST",
    "MORNING_SNACK",
    "LUNCH",
    "AFTERNOON_SNACK",
    "DINNER",
  ]),
  totalCalories: number().optional(),
  totalProteins: number().optional(),
  totalCarbs: number().optional(),
  totalFats: number().optional(),
  dietId: string().optional(),
  accountId: string(),
  foods: string().array().optional(),
});

// GET /meals
const getAllMeals = async (req: Request, res: Response) => {
  try {
    const meals = await prisma.meal.findMany({});

    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /meals/:id
const getMealById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const meal = await prisma.meal.findUnique({
      where: {
        id,
      },
      include: {
        foods: true,
      },
    });
    if (!meal) {
      res.status(404).json({ error: "Meal not found" });
    } else {
      res.json(meal);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /meals
const createMeal = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const body = { ...req.body, accountId };
    const validatedData = mealSchema.parse(body);
    const meal = await prisma.meal.create({
      data: {
        ...validatedData,
        foods: {
          connect: validatedData.foods?.map((foodId: string) => ({
            id: foodId,
          })),
        },
      },
    });
    res.status(201).json(meal);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /meals/:id
const updateMeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const body = { ...req.body, accountId };
    const validatedData = mealSchema.parse(body);
    const updatedMeal = await prisma.meal.update({
      where: {
        id,
      },
      data: {
        ...validatedData,
        foods: {
          connect: validatedData.foods?.map((foodId: string) => ({
            id: foodId,
          })),
        },
      },
    });
    res.json(updatedMeal);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /meals/:id
const deleteMeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.meal.delete({
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
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};
