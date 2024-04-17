"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const meal_controller_1 = __importDefault(require("../controllers/meal.controller"));
const router = express_1.default.Router();
router.get("/?", auth_controller_1.default.verifyToken, meal_controller_1.default.getAllMeals);
router.get("/:id", auth_controller_1.default.verifyToken, meal_controller_1.default.getMealById);
router.delete("/:id", auth_controller_1.default.verifyToken, meal_controller_1.default.deleteMeal);
router.put("/:id", auth_controller_1.default.verifyToken, meal_controller_1.default.updateMeal);
router.post("/", auth_controller_1.default.verifyToken, meal_controller_1.default.createMeal);
exports.default = router;
