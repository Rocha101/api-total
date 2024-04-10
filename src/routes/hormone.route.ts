import express from "express";
import AuthController from "../controllers/auth.controller";
import hormoneController from "../controllers/hormone.controller";
import paginate from "../middlewares/pagination";

const router = express.Router();

router.get("/", AuthController.verifyToken, hormoneController.getAllHormones);
router.get(
  "/:id",
  AuthController.verifyToken,
  hormoneController.getHormoneById
);
router.delete(
  "/:id",
  AuthController.verifyToken,
  hormoneController.deleteHormone
);
router.put("/:id", AuthController.verifyToken, hormoneController.updateHormone);
router.post("/", AuthController.verifyToken, hormoneController.createHormone);
export default router;
