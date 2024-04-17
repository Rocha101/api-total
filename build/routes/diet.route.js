"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const diet_controller_1 = __importDefault(require("../controllers/diet.controller"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.default.verifyToken, diet_controller_1.default.getAllDiets);
router.get("/:id", auth_controller_1.default.verifyToken, diet_controller_1.default.getDietById);
router.get("/protocol/:protocolId", auth_controller_1.default.verifyToken, diet_controller_1.default.getDietByProtocolId);
router.delete("/:id", auth_controller_1.default.verifyToken, diet_controller_1.default.deleteDiet);
router.put("/:id", auth_controller_1.default.verifyToken, diet_controller_1.default.updateDiet);
router.post("/", auth_controller_1.default.verifyToken, diet_controller_1.default.createDiet);
exports.default = router;
