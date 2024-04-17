import express from "express";
import SubscriptionController from "../controllers/subscription.controller";

const router = express.Router();

router.post("/", SubscriptionController.createSubscription);
router.get("/:id", SubscriptionController.getSubscriptionById);
router.get("/verify", SubscriptionController.verifySubscription);

router.get("/plans", SubscriptionController.getPlans);
router.get("/plans/:id", SubscriptionController.getPlanById);
router.post("/plans", SubscriptionController.createPlan);

export default router;
