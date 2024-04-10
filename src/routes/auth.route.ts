import express from "express";
import AuthController from "../controllers/auth.controller";

const router = express.Router();

router.post("/sign-in", AuthController.loginUser);
router.post("/sign-up", AuthController.registerUser);
router.get("/verify", AuthController.verify);

export default router;
