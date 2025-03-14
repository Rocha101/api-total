import { Request, Response } from "express";
import { getAccountId } from "../utils/getAccountId";
import { object, string } from "zod";
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
    const plan = await prisma.plan.findUnique({
      where: { id: validatedData.planId },
    });

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const subscription = await prisma.subscription.create({
      data: {
        expiresAt: new Date(
          new Date().setMonth(new Date().getMonth() + plan.duration)
        ),
        plan: {
          connect: {
            id: validatedData.planId,
          },
        },
      },
      include: { plan: true },
    });

    return res.status(201).json(subscription);
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

    const newSubscription = await prisma.subscription.findUnique({
      where: { id: validatedData.activationId },
      include: { plan: true },
    });

    if (!newSubscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    if (!newSubscription.plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const accountWithNewSubscription = await prisma.account.update({
      where: { id: accountId },
      data: {
        subscriptions: {
          set: {
            id: newSubscription.id,
          },
        },
      },
      include: {
        subscriptions: {
          include: { plan: true },
        },
      },
    });
    return res.status(200).json(accountWithNewSubscription);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update subscription" });
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
