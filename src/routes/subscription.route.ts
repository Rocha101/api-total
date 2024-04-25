import express from "express";
import SubscriptionController from "../controllers/subscription.controller";
import authController from "../controllers/auth.controller";

const router = express.Router();

router.get("/", SubscriptionController.getSubscriptions);
router.post("/", SubscriptionController.createSubscription);
router.get("/:id", SubscriptionController.getSubscriptionById);
router.get(
  "/verify/:id",
  authController.verifyToken,
  SubscriptionController.verifySubscription
);
router.post(
  "/change",
  authController.verifyToken,
  SubscriptionController.changeSubscription
);
router.delete("/:id", SubscriptionController.deleteSubscription);

export default router;
