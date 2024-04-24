import express from "express";
import AuthController from "../controllers/auth.controller";
import notificationController from "../controllers/notification.controller";

const router = express.Router();

router.get(
  "/",
  AuthController.verifyToken,
  notificationController.getNotificationsByAccountId
);
router.delete(
  "/:id",
  AuthController.verifyToken,
  notificationController.deleteNotification
);
router.put(
  "/:id",
  AuthController.verifyToken,
  notificationController.updateNotification
);

export default router;
