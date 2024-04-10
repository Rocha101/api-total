import express from "express";
import AuthController from "../controllers/auth.controller";
import exerciseController from "../controllers/exercise.controller";

const router = express.Router();

router.get("/", AuthController.verifyToken, exerciseController.getAllExercises);
router.get(
  "/:id",
  AuthController.verifyToken,
  exerciseController.getExerciseById
);
router.delete(
  "/:id",
  AuthController.verifyToken,
  exerciseController.deleteExercise
);
router.put(
  "/:id",
  AuthController.verifyToken,
  exerciseController.updateExercise
);
router.post("/", AuthController.verifyToken, exerciseController.createExercise);

export default router;
