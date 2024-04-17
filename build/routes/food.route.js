"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const food_controller_1 = __importDefault(require("../controllers/food.controller"));
const router = express_1.default.Router();
router.get("/?", auth_controller_1.default.verifyToken, food_controller_1.default.getAllFoods);
router.get("/:id", auth_controller_1.default.verifyToken, food_controller_1.default.getFoodById);
router.delete("/:id", auth_controller_1.default.verifyToken, food_controller_1.default.deleteFood);
router.put("/:id", auth_controller_1.default.verifyToken, food_controller_1.default.updateFood);
router.post("/", auth_controller_1.default.verifyToken, food_controller_1.default.createFood);
exports.default = router;
