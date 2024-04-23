import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";

const prisma = new PrismaClient();

// Zod schema for validating the request body when creating or updating a protocol
const protocolSchema = object({
  name: string(),
  description: string().optional(),
  accountId: string().optional(),
  clientId: string().optional(),
  diet: string().optional(),
  train: string().array().optional(),
  hormonalProtocol: string().optional(),
  extraCompound: string().array().optional(),
});

// GET /protocols
const getAllProtocols = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const protocols = await prisma.protocol.findMany({
      where: {
        accountId,
      },
      include: {
        diets: true,
        trains: true,
        hormonalProtocols: true,
        extraCompounds: true,
      },
    });
    res.json(protocols);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProtocolsCount = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const count = await prisma.protocol.count({
      where: {
        accountId,
      },
    });
    res.json(count);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /protocols/:id
const getProtocolById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const protocol = await prisma.protocol.findUnique({
      where: {
        id,
      },
      include: {
        diets: true,
        trains: true,
        hormonalProtocols: true,
        extraCompounds: true,
      },
    });
    if (!protocol) {
      res.status(404).json({ error: "Protocol not found" });
    } else {
      res.json(protocol);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProtocolByClientId = async (req: Request, res: Response) => {
  const { clientId } = req.params;
  try {
    const protocol = await prisma.protocol.findMany({
      where: {
        clientId: clientId,
      },
      include: {
        diets: true,
        trains: true,
        hormonalProtocols: true,
        extraCompounds: true,
      },
    });
    if (!protocol) {
      res.status(404).json({ error: "Protocol not found" });
    } else {
      res.json(protocol[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /protocols
const createProtocol = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const body = { ...req.body };
    const validatedData = protocolSchema.parse(body);
    const protocol = await prisma.protocol.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        accountId,
        clientId: validatedData.clientId,
        ...(validatedData.diet && {
          diets: {
            connect: {
              id: validatedData.diet,
            },
          },
        }),
        ...(validatedData.train && {
          trains: {
            connect: validatedData.train.map((id: string) => ({
              id: id,
            })),
          },
        }),
        ...(validatedData.extraCompound && {
          extraCompounds: {
            connect: validatedData.extraCompound.map((id: string) => ({
              id: id,
            })),
          },
        }),
        ...(validatedData.hormonalProtocol && {
          hormonalProtocols: {
            connect: {
              id: validatedData.hormonalProtocol,
            },
          },
        }),
      },
    });
    res.status(201).json(protocol);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /protocols/:id
const updateProtocol = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const body = { ...req.body, accountId };
    const validatedData = protocolSchema.parse(body);
    const updatedProtocol = await prisma.protocol.update({
      where: {
        id,
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        accountId,
        clientId: validatedData.clientId,
        ...(validatedData.diet && {
          diets: {
            set: {
              id: validatedData.diet,
            },
          },
        }),
        ...(validatedData.train && {
          trains: {
            set: validatedData.train.map((id: string) => ({
              id: id,
            })),
          },
        }),
        ...(validatedData.extraCompound && {
          extraCompounds: {
            set: validatedData.extraCompound.map((id: string) => ({
              id: id,
            })),
          },
        }),
        ...(validatedData.hormonalProtocol && {
          hormonalProtocols: {
            set: {
              id: validatedData.hormonalProtocol,
            },
          },
        }),
      },
    });
    res.json(updatedProtocol);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /protocols/:id
const deleteProtocol = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.protocol.delete({
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
  getAllProtocols,
  getProtocolById,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  getProtocolByClientId,
  getProtocolsCount,
};
