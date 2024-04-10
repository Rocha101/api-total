import express from "express";
import AuthController from "../controllers/auth.controller";
import mealController from "../controllers/meal.controller";
import paginate from "../middlewares/pagination";

const router = express.Router();

router.get("/?", AuthController.verifyToken, mealController.getAllMeals);
router.get("/:id", AuthController.verifyToken, mealController.getMealById);
router.delete("/:id", AuthController.verifyToken, mealController.deleteMeal);
router.put("/:id", AuthController.verifyToken, mealController.updateMeal);
router.post("/", AuthController.verifyToken, mealController.createMeal);
export default router;
