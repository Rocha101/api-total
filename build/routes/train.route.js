"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const train_controller_1 = __importDefault(require("../controllers/train.controller"));
const router = express_1.default.Router();
router.get("/", auth_controller_1.default.verifyToken, train_controller_1.default.getAllTrains);
router.get("/:id", auth_controller_1.default.verifyToken, train_controller_1.default.getTrainById);
router.get("/protocol/:id", auth_controller_1.default.verifyToken, train_controller_1.default.getTrainByProtocolId);
router.delete("/:id", auth_controller_1.default.verifyToken, train_controller_1.default.deleteTrain);
router.put("/:id", auth_controller_1.default.verifyToken, train_controller_1.default.updateTrain);
router.post("/", auth_controller_1.default.verifyToken, train_controller_1.default.createTrain);
exports.default = router;
