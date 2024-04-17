"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const extraCompounds_controller_1 = __importDefault(require("../controllers/extraCompounds.controller"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.default.verifyToken, extraCompounds_controller_1.default.getAllExtraCompounds);
router.get("/:id", auth_controller_1.default.verifyToken, extraCompounds_controller_1.default.getExtraCompoundById);
router.get("/protocol/:protocolId", auth_controller_1.default.verifyToken, extraCompounds_controller_1.default.getExtraCompoundByProtocolId);
router.delete("/:id", auth_controller_1.default.verifyToken, extraCompounds_controller_1.default.deleteExtraCompound);
router.put("/:id", auth_controller_1.default.verifyToken, extraCompounds_controller_1.default.updateExtraCompound);
router.post("/", auth_controller_1.default.verifyToken, extraCompounds_controller_1.default.createExtraCompound);
exports.default = router;
