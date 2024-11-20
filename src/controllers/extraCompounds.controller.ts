import { Request, Response, NextFunction } from "express";
import { object, string, number, enum as enumValidator } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

// Zod schema for validating the request body when creating or updating an extra compound
const extraCompoundSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  quantity: number({
    required_error: "Quantidade é obrigatória",
  }),
  concentration: number().optional(),
  unit: enumValidator(["MG", "ML", "UI", "UNIT"]),
  concentrationUnit: enumValidator(["MG_ML", "MG"]).optional(),
  protocolId: string().optional(),
});

export const getAllExtraCompounds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const extraCompounds = await prisma.extraCompounds.findMany({
      where: { accountId },
    });
    return ApiResponse.success(res, extraCompounds);
  } catch (error) {
    next(error);
  }
};

export const getExtraCompoundById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const extraCompound = await prisma.extraCompounds.findUnique({
      where: { id },
    });

    if (!extraCompound) {
      throw new AppError("Extra compound not found", 404);
    }

    return ApiResponse.success(res, extraCompound);
  } catch (error) {
    next(error);
  }
};

export const createExtraCompound = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = extraCompoundSchema.parse(req.body);

    const extraCompound = await prisma.extraCompounds.create({
      data: {
        ...validatedData,
        accountId: accountId as string,
      },
    });

    return ApiResponse.created(res, extraCompound);
  } catch (error) {
    next(error);
  }
};

export const updateExtraCompound = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const validatedData = extraCompoundSchema.parse(req.body);

    const extraCompound = await prisma.extraCompounds.update({
      where: { id },
      data: {
        ...validatedData,
        accountId: accountId as string,
      },
    });

    return ApiResponse.success(res, extraCompound, "Extra compound updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteExtraCompound = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.extraCompounds.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Extra compound deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const getExtraCompoundByProtocolId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { protocolId } = req.params;
    const extraCompounds = await prisma.extraCompounds.findMany({
      where: {
        protocols: {
          some: {
            id: protocolId,
          },
        },
      },
    });

    if (!extraCompounds) {
      throw new AppError("Extra compound not found", 404);
    }

    return ApiResponse.success(res, extraCompounds);
  } catch (error) {
    next(error);
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
