import express from "express";
import { createCheckoutController } from "../controllers/checkout.controller";

const router = express.Router();

router.get("/verify", createCheckoutController);

export default router;
