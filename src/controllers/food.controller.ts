import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string, number, enum as enumValidator } from "zod";
import { getAccountId } from "../utils/getAccountId";

const prisma = new PrismaClient();

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
  accountId: string(),
});

// GET /foods
const getAllFoods = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const foods = await prisma.food.findMany({
      where: {
        accountId,
      },
    });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /foods/:id
const getFoodById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const food = await prisma.food.findUnique({
      where: {
        id,
      },
    });
    if (!food) {
      res.status(404).json({ error: "Food not found" });
    } else {
      res.json(food);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /foods
const createFood = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      account: {
        id: accountId,
      },
    };
    const validatedData = foodSchema.parse(body);
    const food = await prisma.food.create({
      data: validatedData,
    });
    res.status(201).json(food);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /foods/:id
const updateFood = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      account: {
        id: accountId,
      },
    };
    const validatedData = foodSchema.parse(body);
    const updatedFood = await prisma.food.update({
      where: {
        id,
      },
      data: validatedData,
    });
    res.json(updatedFood);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /foods/:id
const deleteFood = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.food.delete({
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
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
};
