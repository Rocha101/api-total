import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getAccountId } from "../utils/getAccountId";
import { number, object, string } from "zod";

const prisma = new PrismaClient();

const subscriptionSchema = object({
  planId: string(),
});

const planSchema = object({
  name: string(),
  price: number(),
  duration: number(),
});

const createPlan = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = planSchema.parse(req.body);
    const plan = await prisma.plan.create({
      data: {
        ...validatedData,
        account: {
          connect: {
            id: accountId,
          },
        },
      },
    });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: "Failed to create plan" });
  }
};

const getPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: { account: true },
    });
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plan" });
  }
};

const getPlans = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const plans = await prisma.plan.findMany({
      where: {
        accountId,
      },
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};

const createSubscription = async (req: Request, res: Response) => {
  try {
    const validatedData = subscriptionSchema.parse(req.body);
    const subscription = await prisma.subscription.create({
      data: validatedData,
    });
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to create subscription" });
  }
};

const verifySubscription = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const subscription = await prisma.subscription.findFirst({
      where: {
        accountId,
      },
      include: { plan: true },
    });
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    const now = new Date();
    const createdAt = new Date(subscription.createdAt);
    const expiresAt = new Date(createdAt);
    expiresAt.setMonth(createdAt.getMonth() + subscription.plan.duration);

    if (now > expiresAt) {
      return res.status(403).json({ error: "Subscription expired" });
    }
    res.json(subscription);
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
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

export default {
  createSubscription,
  getSubscriptionById,
  createPlan,
  getPlanById,
  getPlans,
  verifySubscription,
};
