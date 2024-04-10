import express from "express";
import AuthController from "../controllers/auth.controller";
import hormoneProtocolController from "../controllers/hormoneProtocol.controller";
import paginate from "../middlewares/pagination";

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
