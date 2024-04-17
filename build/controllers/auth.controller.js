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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../models/prisma"));
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const registerSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    email: (0, zod_1.string)().email(),
    password: (0, zod_1.string)(),
    accountType: (0, zod_1.nativeEnum)(client_1.AccountType),
    coachId: (0, zod_1.string)().optional(),
});
const loginSchema = (0, zod_1.object)({
    email: (0, zod_1.string)().email(),
    password: (0, zod_1.string)(),
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        let validatedData = registerSchema.parse(req.body);
        const { email } = validatedData;
        const user = yield prisma_1.default.account.findUnique({
            where: {
                email,
            },
        });
        if (user) {
            res.status(400).json({ error: "Email já cadastrado" });
            return;
        }
        const newAccount = yield prisma_1.default.account.create({
            data: validatedData,
        });
        console.log(newAccount);
        const token = jsonwebtoken_1.default.sign({ account: newAccount }, "96172890", {
            expiresIn: 4500, // expires in 45 minutes
        });
        res.status(200).json({ token, account: newAccount });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;
        const account = yield prisma_1.default.account.findUnique({
            where: {
                email,
            },
        });
        if (!account || account.password !== password) {
            res.status(400).json({ error: "Credenciais inválidas" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ account }, "96172890", {
            expiresIn: 4500, // expires in 45 minutes
        });
        res.status(200).json({ token, account });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        res.status(400).json({ error: "Token não encontrado" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "96172890");
        req.headers["account-id"] = decoded.account.id;
        next();
    }
    catch (e) {
        res.status(400).json({ error: "Token inválido" });
    }
});
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    console.log(token);
    if (!token) {
        res.status(400).json({ error: "Token não encontrado" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, "96172890");
        res.status(200).json({ account: decoded.account });
    }
    catch (e) {
        res.status(400).json({ error: "Token inválido" });
    }
});
exports.default = { registerUser, loginUser, verifyToken, verify };
