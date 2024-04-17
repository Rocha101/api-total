"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const hormoneProtocol_controller_1 = __importDefault(require("../controllers/hormoneProtocol.controller"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.default.verifyToken, hormoneProtocol_controller_1.default.getAllHormonalProtocols);
router.get("/:id", auth_controller_1.default.verifyToken, hormoneProtocol_controller_1.default.getHormonalProtocolById);
router.get("/protocol/:protocolId", auth_controller_1.default.verifyToken, hormoneProtocol_controller_1.default.getHormonalProtocolByProtocolId);
router.delete("/:id", auth_controller_1.default.verifyToken, hormoneProtocol_controller_1.default.deleteHormonalProtocol);
router.put("/:id", auth_controller_1.default.verifyToken, hormoneProtocol_controller_1.default.updateHormonalProtocol);
router.post("/", auth_controller_1.default.verifyToken, hormoneProtocol_controller_1.default.createHormonalProtocol);
exports.default = router;
