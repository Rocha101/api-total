import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";

const prisma = new PrismaClient();

// Zod schema for validating the request body when creating or updating a hormonal protocol
const hormonalProtocolSchema = object({
  name: string(),
  description: string().optional(),
  protocolId: string().optional(),
  accountId: string().optional(),
  hormones: string().array(),
});

// GET /hormonalProtocols
const getAllHormonalProtocols = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const hormonalProtocols = await prisma.hormonalProtocol.findMany({
      where: {
        accountId,
      },
      include: {
        hormones: true,
      },
    });
    res.json(hormonalProtocols);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /hormonalProtocols/:id
const getHormonalProtocolById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const hormonalProtocol = await prisma.hormonalProtocol.findUnique({
      where: {
        id,
      },
      include: {
        hormones: true,
      },
    });
    if (!hormonalProtocol) {
      res.status(404).json({ error: "Hormonal protocol not found" });
    } else {
      res.json(hormonalProtocol);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getHormonalProtocolByProtocolId = async (req: Request, res: Response) => {
  const { protocolId } = req.params;
  try {
    const hormonalProtocols = await prisma.hormonalProtocol.findMany({
      where: {
        protocols: {
          some: {
            id: protocolId,
          },
        },
      },
      include: {
        hormones: true,
      },
    });
    res.json(hormonalProtocols);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /hormonalProtocols
const createHormonalProtocol = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = hormonalProtocolSchema.parse(req.body);
    const hormonalProtocol = await prisma.hormonalProtocol.create({
      data: {
        ...validatedData,
        accountId,
        hormones: {
          connect: validatedData.hormones.map((id: string) => ({ id })),
        },
      },
    });
    res.status(201).json(hormonalProtocol);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /hormonalProtocols/:id
const updateHormonalProtocol = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = hormonalProtocolSchema.parse(req.body);

    const updatedHormonalProtocol = await prisma.hormonalProtocol.update({
      where: {
        id,
      },
      data: {
        ...validatedData,
        accountId,
        hormones: {
          set: validatedData.hormones.map((id: string) => ({ id })),
        },
      },
    });
    res.json(updatedHormonalProtocol);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /hormonalProtocols/:id
const deleteHormonalProtocol = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.hormonalProtocol.delete({
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
  getAllHormonalProtocols,
  getHormonalProtocolById,
  createHormonalProtocol,
  updateHormonalProtocol,
  deleteHormonalProtocol,
  getHormonalProtocolByProtocolId,
};
