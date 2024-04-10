import express from "express";
import AuthController from "../controllers/auth.controller";
import foodController from "../controllers/food.controller";

const router = express.Router();

router.get("/?", AuthController.verifyToken, foodController.getAllFoods);
router.get("/:id", AuthController.verifyToken, foodController.getFoodById);
router.delete("/:id", AuthController.verifyToken, foodController.deleteFood);
router.put("/:id", AuthController.verifyToken, foodController.updateFood);
router.post("/", AuthController.verifyToken, foodController.createFood);
export default router;
