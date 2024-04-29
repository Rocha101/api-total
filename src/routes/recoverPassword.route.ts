import express from "express";
import RecoverPasswordController from "../controllers/recoverPassword.controller";

const router = express.Router();

router.post("/", RecoverPasswordController.recoverPassword);
router.put("/new-password/:id", RecoverPasswordController.updatePassword);

export default router;
