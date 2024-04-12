import express from "express";
import AuthController from "../controllers/auth.controller";
import trainController from "../controllers/train.controller";
import paginate from "../middlewares/pagination";

const router = express.Router();

router.get("/", AuthController.verifyToken, trainController.getAllTrains);
router.get("/:id", AuthController.verifyToken, trainController.getTrainById);
router.get(
  "/protocol/:id",
  AuthController.verifyToken,
  trainController.getTrainByProtocolId
);
router.delete("/:id", AuthController.verifyToken, trainController.deleteTrain);
router.put("/:id", AuthController.verifyToken, trainController.updateTrain);
router.post("/", AuthController.verifyToken, trainController.createTrain);
export default router;
