import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { getAccountId } from "../utils/getAccountId";
import { nativeEnum, object, string } from "zod";
import { AccountType } from "@prisma/client";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

const accountSchema = object({
  name: string(),
  email: string().email(),
  password: string(),
  accountType: nativeEnum(AccountType),
  activationKey: string().optional(),
  accountImageUrl: string().optional(),
});

const updateAccountSchema = object({
  name: string().optional(),
  email: string().email().optional(),
  password: string().optional(),
  activationKey: string().optional(),
  accountImageUrl: string().optional(),
});

export const getAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allAccount = await prisma.account.findMany({});
    return ApiResponse.success(res, allAccount);
  } catch (error) {
    next(error);
  }
};

export const getAccountById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    return ApiResponse.success(res, account);
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = updateAccountSchema.parse(req.body);
    
    const account = await prisma.account.update({
      where: { id },
      data: validatedData,
    });

    return ApiResponse.success(res, account, 'Account updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.$transaction([
      prisma.notification.deleteMany({
        where: { accountId: id },
      }),
      prisma.account.delete({
        where: { id },
      }),
    ]);

    return ApiResponse.success(res, null, 'Account deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const getClientsByCoachId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    
    const clients = await prisma.account.findMany({
      where: { coachId: accountId },
    });

    return ApiResponse.success(res, clients);
  } catch (error) {
    next(error);
  }
};

export const getClientsCountByCoachId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    
    const count = await prisma.account.count({
      where: { coachId: accountId },
    });

    return ApiResponse.success(res, { count });
  } catch (error) {
    next(error);
  }
};

export default {
  getAccount,
  getAccountById,
  updateAccount,
  deleteAccount,
  getClientsByCoachId,
  getClientsCountByCoachId,
};
