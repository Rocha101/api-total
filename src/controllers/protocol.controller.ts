import { Request, Response, NextFunction } from "express";
import { object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

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
export const getAllProtocols = async (req: Request, res: Response, next: NextFunction) => {
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
    return ApiResponse.success(res, protocols);
  } catch (error) {
    next(error);
  }
};

export const getProtocolsCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const count = await prisma.protocol.count({
      where: {
        accountId,
      },
    });
    return ApiResponse.success(res, { count });
  } catch (error) {
    next(error);
  }
};

// GET /protocols/:id
export const getProtocolById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
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
      throw new AppError("Protocol not found", 404);
    }

    return ApiResponse.success(res, protocol);
  } catch (error) {
    next(error);
  }
};

export const getProtocolByClientId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clientId } = req.params;
    const protocols = await prisma.protocol.findMany({
      where: {
        clientId: clientId as string,
      },
      include: {
        diets: true,
        trains: true,
        hormonalProtocols: true,
        extraCompounds: true,
      },
    });

    if (!protocols.length) {
      throw new AppError("No protocols found for this client", 404);
    }

    return ApiResponse.success(res, protocols[0]);
  } catch (error) {
    next(error);
  }
};

// POST /protocols
export const createProtocol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = protocolSchema.parse(req.body);
    const accountId = await getAccountId(req, res);

    const protocol = await prisma.protocol.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        account: {
          connect: {
            id: accountId,
          },
        },
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
      include: {
        diets: true,
        trains: true,
        hormonalProtocols: true,
        extraCompounds: true,
      },
    });

    return ApiResponse.created(res, protocol);
  } catch (error) {
    next(error);
  }
};

// PUT /protocols/:id
export const updateProtocol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = protocolSchema.parse(req.body);

    const existingProtocol = await prisma.protocol.findUnique({
      where: {
        id,
      },
    });

    if (!existingProtocol) {
      throw new AppError("Protocol not found", 404);
    }

    const protocol = await prisma.protocol.update({
      where: {
        id,
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        clientId: validatedData.clientId,
        account: {
          connect: {
            id: await getAccountId(req, res),
          },
        },
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
      include: {
        diets: true,
        trains: true,
        hormonalProtocols: true,
        extraCompounds: true,
      },
    });

    return ApiResponse.success(res, protocol, "Protocol updated successfully");
  } catch (error) {
    next(error);
  }
};

// DELETE /protocols/:id
export const deleteProtocol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingProtocol = await prisma.protocol.findUnique({
      where: {
        id,
      },
    });

    if (!existingProtocol) {
      throw new AppError("Protocol not found", 404);
    }

    await prisma.protocol.delete({
      where: {
        id,
      },
    });

    return ApiResponse.success(res, null, "Protocol deleted successfully");
  } catch (error) {
    next(error);
  }
};

export default {
  getAllProtocols,
  getProtocolById,
  getProtocolByClientId,
  getProtocolsCount,
  createProtocol,
  updateProtocol,
  deleteProtocol,
};
