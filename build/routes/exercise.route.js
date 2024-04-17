"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const exercise_controller_1 = __importDefault(require("../controllers/exercise.controller"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.default.verifyToken, exercise_controller_1.default.getAllExercises);
router.get("/:id", auth_controller_1.default.verifyToken, exercise_controller_1.default.getExerciseById);
router.delete("/:id", auth_controller_1.default.verifyToken, exercise_controller_1.default.deleteExercise);
router.put("/:id", auth_controller_1.default.verifyToken, exercise_controller_1.default.updateExercise);
router.post("/", auth_controller_1.default.verifyToken, exercise_controller_1.default.createExercise);
exports.default = router;
