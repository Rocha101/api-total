import { Request, Response } from "express";
import { getAccountId } from "../utils/getAccountId";
import { number, object, string } from "zod";
import prisma from "../models/prisma";

const subscriptionSchema = object({
  planId: string(),
});

const subscriptionIdSchema = object({
  activationId: string(),
});

const createSubscription = async (req: Request, res: Response) => {
  try {
    const validatedData = subscriptionSchema.parse(req.body);
    const subscription = await prisma.subscription.create({
      data: {
        plan: {
          connect: {
            id: validatedData.planId,
          },
        },
      },
      include: { plan: true },
    });

    if (subscription.plan) {
      const subscriptionWithExpireDate = await prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          expiresAt: new Date(
            subscription.createdAt.setMonth(
              subscription.createdAt.getMonth() + subscription.plan.duration
            )
          ),
        },
      });

      res.status(200).json(subscriptionWithExpireDate);
    }

    return res.status(404).json({ error: "Plan not found" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription" });
  }
};

const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: { plan: true, account: true },
    });

    const now = new Date();
    const validSubscriptions = subscriptions.filter((subscription) => {
      if (!subscription.plan) return false;
      const createdAt = new Date(subscription.createdAt);
      const expiresAt = new Date(createdAt);
      expiresAt.setMonth(createdAt.getMonth() + subscription.plan.duration);
      return now < expiresAt;
    });

    const expiredSubscriptions = subscriptions.filter((subscription) => {
      if (!subscription.plan) return false;
      const createdAt = new Date(subscription.createdAt);
      const expiresAt = new Date(createdAt);
      expiresAt.setMonth(createdAt.getMonth() + subscription.plan.duration);
      return now > expiresAt;
    });

    res.status(200).json({
      validSubscriptions,
      expiredSubscriptions,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
};

const verifySubscription = async (req: Request, res: Response) => {
  try {
    const { id: accountId } = req.params;
    const subscription = await prisma.subscription.findFirst({
      where: {
        accountId,
      },
      include: { plan: true },
    });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    if (!subscription.plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const now = new Date();
    const createdAt = new Date(subscription.createdAt);
    const expiresAt = new Date(createdAt);
    expiresAt.setMonth(createdAt.getMonth() + subscription.plan.duration);

    if (now > expiresAt) {
      return res.status(403).json({ error: "Subscription expired" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

const getSubscriptionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

const changeSubscription = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = subscriptionIdSchema.parse(req.body);
    const subscription = await prisma.subscription.deleteMany({
      where: {
        accountId,
      },
    });
    const accountWithNewSubscription = await prisma.account.update({
      where: { id: accountId },
      data: {
        subscriptions: {
          connect: {
            id: validatedData.activationId,
          },
        },
      },
      include: { subscriptions: true },
    });
    res.status(200).json(accountWithNewSubscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to update subscription" });
  }
};

const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = await prisma.subscription.delete({
      where: { id },
    });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete subscription" });
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
