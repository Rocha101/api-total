import express from "express";
import AuthController from "../controllers/auth.controller";
import accountController from "../controllers/account.controller";
import paginate from "../middlewares/pagination";

const router = express.Router();

router.get("/", AuthController.verifyToken, accountController.getAccount);
router.get(
  "/clients",
  AuthController.verifyToken,
  accountController.getClientsByCoachId
);

router.get(
  "/:id",
  AuthController.verifyToken,
  accountController.getAccountById
);
router.delete(
  "/:id",
  AuthController.verifyToken,
  accountController.deleteAccount
);
router.put("/:id", AuthController.verifyToken, accountController.updateAccount);

export default router;
