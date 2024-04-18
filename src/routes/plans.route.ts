import express from "express";
import PlanController from "../controllers/plan.controller";

const router = express.Router();

router.get("/", PlanController.getPlans);
router.get("/:id", PlanController.getPlanById);
router.post("/", PlanController.createPlan);
router.delete("/:id", PlanController.deletePlan);

export default router;
