import express from "express";
import SubscriptionController from "../controllers/subscription.controller";

const router = express.Router();

router.get("/", SubscriptionController.getSubscriptions);
router.post("/", SubscriptionController.createSubscription);
router.get("/:id", SubscriptionController.getSubscriptionById);
router.get("/verify/:id", SubscriptionController.verifySubscription);
router.post("/change", SubscriptionController.changeSubscription);
router.delete("/:id", SubscriptionController.deleteSubscription);

export default router;
