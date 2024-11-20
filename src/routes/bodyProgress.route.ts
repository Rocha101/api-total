import express from "express";
import bodyProgressController from "../controllers/bodyProgress.controller";
import AuthController from "../controllers/auth.controller";
import { createRouteHandler } from "uploadthing/express";
import { uploadRouter } from "../config/uploadthing";

const router = express.Router();

// Upload route for body progress images
router.post("/upload", AuthController.verifyToken, createRouteHandler(uploadRouter));

// Body progress CRUD routes
router.post("/", AuthController.verifyToken, bodyProgressController.createBodyProgress);
router.get("/", AuthController.verifyToken, bodyProgressController.getBodyProgress);
router.get("/:id", AuthController.verifyToken, bodyProgressController.getBodyProgressById);
router.put("/:id", AuthController.verifyToken, bodyProgressController.updateBodyProgress);
router.delete("/:id", AuthController.verifyToken, bodyProgressController.deleteBodyProgress);

export default router;
