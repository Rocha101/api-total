import express from "express";
import AuthController from "../controllers/auth.controller";
import protocolController from "../controllers/protocol.controller";

const router = express.Router();

router.get("/", AuthController.verifyToken, protocolController.getAllProtocols);
router.get(
  "/:id",
  AuthController.verifyToken,
  protocolController.getProtocolById
);
router.get(
  "/count/number",
  AuthController.verifyToken,
  protocolController.getProtocolsCount
);
router.get(
  "/clients/:clientId",
  AuthController.verifyToken,
  protocolController.getProtocolByClientId
);
router.delete(
  "/:id",
  AuthController.verifyToken,
  protocolController.deleteProtocol
);
router.put(
  "/:id",
  AuthController.verifyToken,
  protocolController.updateProtocol
);
router.post("/", AuthController.verifyToken, protocolController.createProtocol);

export default router;
