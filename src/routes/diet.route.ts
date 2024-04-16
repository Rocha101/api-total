import express from "express";
import AuthController from "../controllers/auth.controller";
import dietController from "../controllers/diet.controller";
import paginate from "../middlewares/pagination";

const router = express.Router();

router.get("/", AuthController.verifyToken, dietController.getAllDiets);
router.get("/:id", AuthController.verifyToken, dietController.getDietById);
router.get(
  "/protocol/:protocolId",
  AuthController.verifyToken,
  dietController.getDietByProtocolId
);
router.delete("/:id", AuthController.verifyToken, dietController.deleteDiet);
router.put("/:id", AuthController.verifyToken, dietController.updateDiet);
router.post("/", AuthController.verifyToken, dietController.createDiet);
export default router;
