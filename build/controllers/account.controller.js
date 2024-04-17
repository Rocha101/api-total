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
const prisma_1 = __importDefault(require("../models/prisma"));
const getAccountId_1 = require("../utils/getAccountId");
const getAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allAccount = yield prisma_1.default.account.findMany({});
        res.status(200).json(allAccount);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
const getAccountById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const account = yield prisma_1.default.account.findUnique({
            where: {
                id,
            },
        });
        res.status(200).json(account);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
const getClientsByCoachId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const account = yield prisma_1.default.account.findMany({
            where: {
                coachId: accountId,
            },
        });
        res.status(200).json(account);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
const updateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, email } = req.body;
        const updatedAccount = yield prisma_1.default.account.update({
            where: {
                id,
            },
            data: {
                name,
                email,
            },
        });
        res.status(200).json(updatedAccount);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedAccount = yield prisma_1.default.account.delete({
            where: {
                id,
            },
        });
        res.status(200).json(deletedAccount);
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
});
exports.default = {
    getAccount,
    getAccountById,
    updateAccount,
    deleteAccount,
    getClientsByCoachId,
};
