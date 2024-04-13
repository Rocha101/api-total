import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { connect } from "http2";

const prisma = new PrismaClient();

// Zod schema for validating the request body when creating or updating a diet
const dietSchema = object({
  name: string(),
  description: string().optional(),
  protocolId: string().optional(),
  accountId: string(),
  meals: string().array(),
});

// GET /diets
const getAllDiets = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);

    const diets = await prisma.diet.findMany({
      where: {
        accountId,
      },
      include: {
        meals: true,
      },
    });
    res.json(diets);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /diets/:id
const getDietById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const diet = await prisma.diet.findUnique({
      where: {
        id,
      },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });
    if (!diet) {
      res.status(404).json({ error: "Diet not found" });
    } else {
      res.json(diet);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /diets
const createDiet = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      accountId,
    };
    const validatedData = dietSchema.parse(body);
    const diet = await prisma.diet.create({
      data: {
        ...validatedData,
        meals: {
          connect: validatedData.meals.map((mealId: string) => ({
            id: mealId,
          })),
        },
      },
    });
    res.status(201).json(diet);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /diets/:id
const updateDiet = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const body = { ...req.body, accountId };
    const validatedData = dietSchema.parse(body);
    const updatedDiet = await prisma.diet.update({
      where: {
        id,
      },
      data: {
        ...validatedData,
        meals: {
          connect: validatedData.meals.map((mealId: string) => ({
            id: mealId,
          })),
        },
      },
    });
    res.json(updatedDiet);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /diets/:id
const deleteDiet = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.diet.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { getAllDiets, getDietById, createDiet, updateDiet, deleteDiet };
