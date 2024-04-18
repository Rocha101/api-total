import { Request, Response } from "express";
import { number, object, string } from "zod";
import prisma from "../models/prisma";

const planSchema = object({
  name: string(),
  price: number(),
  duration: number(),
});

const createPlan = async (req: Request, res: Response) => {
  try {
    const validatedData = planSchema.parse(req.body);
    const plan = await prisma.plan.create({
      data: validatedData,
    });
    res.status(200).json(plan);
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
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plan" });
  }
};

const getPlans = async (req: Request, res: Response) => {
  try {
    const plans = await prisma.plan.findMany({});

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};

const deletePlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const plan = await prisma.plan.delete({
      where: { id },
    });
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete plan" });
  }
};

export default {
  createPlan,
  getPlanById,
  getPlans,
  deletePlan,
};
