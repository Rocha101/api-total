"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const account_route_1 = __importDefault(require("./routes/account.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const hormone_route_1 = __importDefault(require("./routes/hormone.route"));
const train_route_1 = __importDefault(require("./routes/train.route"));
const diet_route_1 = __importDefault(require("./routes/diet.route"));
const hormoneProtocol_route_1 = __importDefault(require("./routes/hormoneProtocol.route"));
const meal_route_1 = __importDefault(require("./routes/meal.route"));
const protocol_route_1 = __importDefault(require("./routes/protocol.route"));
const extraCompound_route_1 = __importDefault(require("./routes/extraCompound.route"));
const exercise_route_1 = __importDefault(require("./routes/exercise.route"));
const food_route_1 = __importDefault(require("./routes/food.route"));
const qs_1 = __importDefault(require("qs"));
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
var cors = require("cors");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use(cors());
        app.use(express_1.default.json());
        app.set("query parser", (str) => qs_1.default.parse(str, { arrayLimit: 1000 }));
        app.use("/account", account_route_1.default);
        app.use("/auth", auth_route_1.default);
        app.use("/hormone", hormone_route_1.default);
        app.use("/train", train_route_1.default);
        app.use("/diet", diet_route_1.default);
        app.use("/hormoneProtocol", hormoneProtocol_route_1.default);
        app.use("/meal", meal_route_1.default);
        app.use("/protocol", protocol_route_1.default);
        app.use("/extraCompound", extraCompound_route_1.default);
        app.use("/exercise", exercise_route_1.default);
        app.use("/food", food_route_1.default);
        app.all("*", (req, res) => {
            res.status(404).json({ error: `Route ${req.originalUrl} not found` });
        });
        app.listen(port, "0.0.0.0", () => {
            console.log(`Server is listening on port ${port}`);
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.$connect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield exports.prisma.$disconnect();
    process.exit(1);
}));
