"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const hormone_controller_1 = __importDefault(require("../controllers/hormone.controller"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.default.verifyToken, hormone_controller_1.default.getAllHormones);
router.get("/:id", auth_controller_1.default.verifyToken, hormone_controller_1.default.getHormoneById);
router.delete("/:id", auth_controller_1.default.verifyToken, hormone_controller_1.default.deleteHormone);
router.put("/:id", auth_controller_1.default.verifyToken, hormone_controller_1.default.updateHormone);
router.post("/", auth_controller_1.default.verifyToken, hormone_controller_1.default.createHormone);
exports.default = router;
