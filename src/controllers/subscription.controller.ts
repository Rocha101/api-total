import { Request, Response, NextFunction } from "express";
import { getAccountId } from "../utils/getAccountId";
import { object, string } from "zod";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

const subscriptionSchema = object({
  planId: string(),
});

const subscriptionIdSchema = object({
  activationId: string(),
});

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = subscriptionSchema.parse(req.body);

    const subscription = await prisma.subscription.create({
      data: {
        planId: validatedData.planId,
        accountId: accountId as string,
      },
      include: {
        plan: true,
        account: true,
      },
    });

    return ApiResponse.created(res, subscription);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        plan: true,
        account: true,
      },
    });

    if (!subscription) {
      throw new AppError("Subscription not found", 404);
    }

    return ApiResponse.success(res, subscription);
  } catch (error) {
    next(error);
  }
};

export const verifySubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const subscription = await prisma.subscription.findFirst({
      where: { accountId },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      throw new AppError("No active subscription found", 404);
    }

    return ApiResponse.success(res, subscription);
  } catch (error) {
    next(error);
  }
};

export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        plan: true,
        account: true,
      },
    });

    return ApiResponse.success(res, subscriptions);
  } catch (error) {
    next(error);
  }
};

export const changeSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = subscriptionIdSchema.parse(req.body);

    const currentSubscription = await prisma.subscription.findFirst({
      where: { accountId },
    });

    if (!currentSubscription) {
      throw new AppError("No active subscription found", 404);
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: currentSubscription.id },
      data: {
        id: validatedData.activationId,
      },
      include: {
        plan: true,
        account: true,
      },
    });

    return ApiResponse.success(res, updatedSubscription, "Subscription updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.subscription.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Subscription deleted successfully");
  } catch (error) {
    next(error);
  }
};

export default {
  createSubscription,
  getSubscriptionById,
  verifySubscription,
  getSubscriptions,
  changeSubscription,
  deleteSubscription,
};
