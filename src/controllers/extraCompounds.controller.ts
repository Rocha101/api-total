import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string, number, enum as enumValidator } from "zod";
import { getAccountId } from "../utils/getAccountId";

const prisma = new PrismaClient();

// Zod schema for validating the request body when creating or updating an extra compound
const extraCompoundSchema = object({
  name: string(),
  description: string().optional(),
  quantity: number(),
  concentration: number().optional(),
  concentrationUnit: enumValidator(["MG_ML", "MG"]).optional(),
  unit: enumValidator(["MG", "ML", "UI"]),
  protocolId: string().optional(),
  accountId: string().optional(),
});

// GET /extraCompounds
const getAllExtraCompounds = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const extraCompounds = await prisma.extraCompounds.findMany({
      where: {
        account: {
          id: accountId,
        },
      },
    });
    res.json(extraCompounds);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /extraCompounds/:id
const getExtraCompoundById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const extraCompound = await prisma.extraCompounds.findUnique({
      where: {
        id,
      },
    });
    if (!extraCompound) {
      res.status(404).json({ error: "Extra compound not found" });
    } else {
      res.json(extraCompound);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExtraCompoundByProtocolId = async (req: Request, res: Response) => {
  const { protocolId } = req.params;
  try {
    const extraCompounds = await prisma.extraCompounds.findMany({
      where: {
        protocolId,
      },
    });
    if (!extraCompounds) {
      res.status(404).json({ error: "Extra compound not found" });
    } else {
      res.json(extraCompounds);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /extraCompounds
const createExtraCompound = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      account: {
        connect: {
          id: accountId,
        },
      },
    };
    const validatedData = extraCompoundSchema.parse(body);
    const extraCompound = await prisma.extraCompounds.create({
      data: validatedData,
    });
    res.status(201).json(extraCompound);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /extraCompounds/:id
const updateExtraCompound = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const body = {
      ...req.body,
      account: {
        connect: {
          id: accountId,
        },
      },
    };
    const validatedData = extraCompoundSchema.parse(body);
    const updatedExtraCompound = await prisma.extraCompounds.update({
      where: {
        id,
      },
      data: validatedData,
    });
    res.json(updatedExtraCompound);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /extraCompounds/:id
const deleteExtraCompound = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.extraCompounds.delete({
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
  getAllExtraCompounds,
  getExtraCompoundById,
  createExtraCompound,
  updateExtraCompound,
  deleteExtraCompound,
  getExtraCompoundByProtocolId,
};
