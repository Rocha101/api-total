import express from "express";
import AuthController from "../controllers/auth.controller";
import protocolController from "../controllers/protocol.controller";
import paginate from "../middlewares/pagination";

const router = express.Router();

router.get("/", AuthController.verifyToken, protocolController.getAllProtocols);
router.get(
  "/:id",
  AuthController.verifyToken,
  protocolController.getProtocolById
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
