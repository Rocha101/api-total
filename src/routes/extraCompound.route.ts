import express from "express";
import AuthController from "../controllers/auth.controller";
import extraCompoundController from "../controllers/extraCompounds.controller";
import paginate from "../middlewares/pagination";

const router = express.Router();

router.get(
  "/",
  AuthController.verifyToken,
  extraCompoundController.getAllExtraCompounds
);
router.get(
  "/:id",
  AuthController.verifyToken,
  extraCompoundController.getExtraCompoundById
);
router.get(
  "/protocol/:protocolId",
  AuthController.verifyToken,
  extraCompoundController.getExtraCompoundByProtocolId
);
router.delete(
  "/:id",
  AuthController.verifyToken,
  extraCompoundController.deleteExtraCompound
);
router.put(
  "/:id",
  AuthController.verifyToken,
  extraCompoundController.updateExtraCompound
);
router.post(
  "/",
  AuthController.verifyToken,
  extraCompoundController.createExtraCompound
);

export default router;
