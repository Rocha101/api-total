import { Request, Response, NextFunction } from "express";
import { object, string, number, enum as enumValidator } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

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

export const getAllHormones = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const hormones = await prisma.hormone.findMany({
      where: { accountId },
    });
    return ApiResponse.success(res, hormones);
  } catch (error) {
    next(error);
  }
};

export const getHormoneById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const hormone = await prisma.hormone.findUnique({
      where: { id },
    });

    if (!hormone) {
      throw new AppError("Hormone not found", 404);
    }

    return ApiResponse.success(res, hormone);
  } catch (error) {
    next(error);
  }
};

export const createHormone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = hormoneSchema.parse(req.body);

    const hormone = await prisma.hormone.create({
      data: {
        ...validatedData,
        accountId: accountId as string,
      },
    });

    return ApiResponse.created(res, hormone);
  } catch (error) {
    next(error);
  }
};

export const updateHormone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const accountId = await getAccountId(req, res);
    const validatedData = hormoneSchema.parse(req.body);

    const hormone = await prisma.hormone.update({
      where: { id },
      data: {
        ...validatedData,
        accountId: accountId as string,
      },
    });

    return ApiResponse.success(res, hormone, "Hormone updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteHormone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.hormone.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Hormone deleted successfully");
  } catch (error) {
    next(error);
  }
};

export default {
  getAllHormones,
  getHormoneById,
  createHormone,
  updateHormone,
  deleteHormone,
};
