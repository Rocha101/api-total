import { Request, Response, NextFunction } from "express";
import { object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

// Zod schema for validating the request body when creating or updating a hormonal protocol
const hormonalProtocolSchema = object({
  name: string(),
  description: string().optional(),
  protocolId: string().optional(),
  accountId: string().optional(),
  hormones: string().array(),
});

export const getAllHormonalProtocols = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const protocols = await prisma.hormonalProtocol.findMany({
      where: { accountId },
      include: {
        hormones: true,
      },
    });
    return ApiResponse.success(res, protocols);
  } catch (error) {
    next(error);
  }
};

export const getHormonalProtocolById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const protocol = await prisma.hormonalProtocol.findUnique({
      where: { id },
      include: {
        hormones: true,
      },
    });

    if (!protocol) {
      throw new AppError("Hormonal protocol not found", 404);
    }

    return ApiResponse.success(res, protocol);
  } catch (error) {
    next(error);
  }
};

export const createHormonalProtocol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = hormonalProtocolSchema.parse(req.body);

    const protocol = await prisma.hormonalProtocol.create({
      data: {
        ...validatedData,
        accountId: accountId as string,
        hormones: {
          connect: validatedData.hormones.map((hormoneId: string) => ({
            id: hormoneId,
          })),
        },
      },
      include: {
        hormones: true,
      },
    });

    return ApiResponse.created(res, protocol);
  } catch (error) {
    next(error);
  }
};

export const updateHormonalProtocol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const validatedData = hormonalProtocolSchema.parse(req.body);

    const protocol = await prisma.hormonalProtocol.update({
      where: { id },
      data: {
        ...validatedData,
        accountId: accountId as string,
        hormones: {
          set: validatedData.hormones.map((hormoneId: string) => ({
            id: hormoneId,
          })),
        },
      },
      include: {
        hormones: true,
      },
    });

    return ApiResponse.success(res, protocol, "Hormonal protocol updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteHormonalProtocol = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.hormonalProtocol.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Hormonal protocol deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getHormonalProtocolByProtocolId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { protocolId } = req.params;
    const protocols = await prisma.hormonalProtocol.findMany({
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

    if (!protocols) {
      throw new AppError("Hormonal protocol not found", 404);
    }

    return ApiResponse.success(res, protocols);
  } catch (error) {
    next(error);
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
