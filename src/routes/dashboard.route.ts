import express from "express";
import AuthController from "../controllers/auth.controller";
import protocolController from "../controllers/protocol.controller";
import accountController from "../controllers/account.controller";

const router = express.Router();

router.get(
  "/protocolCount",
  AuthController.verifyToken,
  protocolController.getProtocolsCount
);

router.get(
  "/clientsCount",
  AuthController.verifyToken,
  accountController.getClientsCountByCoachId
);

export default router;
