import express from "express";
import AuthController from "../controllers/auth.controller";
import hormoneProtocolController from "../controllers/hormoneProtocol.controller";

const router = express.Router();

router.get(
  "/",
  AuthController.verifyToken,
  hormoneProtocolController.getAllHormonalProtocols
);
router.get(
  "/:id",
  AuthController.verifyToken,
  hormoneProtocolController.getHormonalProtocolById
);
router.get(
  "/protocol/:protocolId",
  AuthController.verifyToken,
  hormoneProtocolController.getHormonalProtocolByProtocolId
);
router.delete(
  "/:id",
  AuthController.verifyToken,
  hormoneProtocolController.deleteHormonalProtocol
);
router.put(
  "/:id",
  AuthController.verifyToken,
  hormoneProtocolController.updateHormonalProtocol
);
router.post(
  "/",
  AuthController.verifyToken,
  hormoneProtocolController.createHormonalProtocol
);

export default router;
