import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string, number, enum as enumValidator } from "zod";
import { getAccountId } from "../utils/getAccountId";

const prisma = new PrismaClient();

// Zod schema for validating the request body when creating or updating a hormone
const hormoneSchema = object({
  name: string(),
  description: string().optional(),
  quantity: number(),
  unit: enumValidator(["MG", "ML", "UI", "UNIT"]),
  concentration: number().optional(),
  concentrationUnit: enumValidator(["MG_ML", "MG"]).optional(),
  hormoneType: enumValidator([
    "NINETEEN_NOR",
    "DHT",
    "TESTOSTERONE",
    "PEPTIDE",
    "INSULIN",
    "TIREOID",
  ]),
  protocolId: string().optional(),
  accountId: string().optional(),
});

// GET /hormones
const getAllHormones = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const hormones = await prisma.hormone.findMany({
      where: {
        accountId,
      },
    });
    res.json(hormones);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /hormones/:id
const getHormoneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hormone = await prisma.hormone.findUnique({
      where: {
        id,
      },
    });
    if (!hormone) {
      res.status(404).json({ error: "Hormone not found" });
    } else {
      res.json(hormone);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /hormones
const createHormone = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      account: {
        id: accountId,
      },
    };
    const validatedData = hormoneSchema.parse(body);
    const hormone = await prisma.hormone.create({
      data: validatedData,
    });
    res.status(201).json(hormone);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /hormones/:id
const updateHormone = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      account: {
        id: accountId,
      },
    };
    const validatedData = hormoneSchema.parse(body);
    const updatedHormone = await prisma.hormone.update({
      where: {
        id,
      },
      data: validatedData,
    });
    res.json(updatedHormone);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /hormones/:id
const deleteHormone = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.hormone.delete({
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
  getAllHormones,
  getHormoneById,
  createHormone,
  updateHormone,
  deleteHormone,
};
