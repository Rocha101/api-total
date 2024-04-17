"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const account_controller_1 = __importDefault(require("../controllers/account.controller"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.default.verifyToken, account_controller_1.default.getAccount);
router.get("/clients", auth_controller_1.default.verifyToken, account_controller_1.default.getClientsByCoachId);
router.get("/:id", auth_controller_1.default.verifyToken, account_controller_1.default.getAccountById);
router.delete("/:id", auth_controller_1.default.verifyToken, account_controller_1.default.deleteAccount);
router.put("/:id", auth_controller_1.default.verifyToken, account_controller_1.default.updateAccount);
exports.default = router;
