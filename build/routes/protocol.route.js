"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const protocol_controller_1 = __importDefault(require("../controllers/protocol.controller"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.default.verifyToken, protocol_controller_1.default.getAllProtocols);
router.get("/:id", auth_controller_1.default.verifyToken, protocol_controller_1.default.getProtocolById);
router.get("/clients/:clientId", auth_controller_1.default.verifyToken, protocol_controller_1.default.getProtocolByClientId);
router.delete("/:id", auth_controller_1.default.verifyToken, protocol_controller_1.default.deleteProtocol);
router.put("/:id", auth_controller_1.default.verifyToken, protocol_controller_1.default.updateProtocol);
router.post("/", auth_controller_1.default.verifyToken, protocol_controller_1.default.createProtocol);
exports.default = router;
