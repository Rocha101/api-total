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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const getAccountId_1 = require("../utils/getAccountId");
const prisma = new client_1.PrismaClient();
// Zod schema for validating the request body when creating or updating an extra compound
const extraCompoundSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    description: (0, zod_1.string)().optional(),
    quantity: (0, zod_1.number)(),
    concentration: (0, zod_1.number)().optional(),
    concentrationUnit: (0, zod_1.enum)(["MG_ML", "MG"]).optional(),
    unit: (0, zod_1.enum)(["MG", "ML", "UI"]),
    protocolId: (0, zod_1.string)().optional(),
    accountId: (0, zod_1.string)().optional(),
});
// GET /extraCompounds
const getAllExtraCompounds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const extraCompounds = yield prisma.extraCompounds.findMany({
            where: {
                accountId,
            },
        });
        res.json(extraCompounds);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /extraCompounds/:id
const getExtraCompoundById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const extraCompound = yield prisma.extraCompounds.findUnique({
            where: {
                id,
            },
        });
        if (!extraCompound) {
            res.status(404).json({ error: "Extra compound not found" });
        }
        else {
            res.json(extraCompound);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
const getExtraCompoundByProtocolId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { protocolId } = req.params;
    try {
        const extraCompounds = yield prisma.extraCompounds.findMany({
            where: {
                protocolId,
            },
        });
        if (!extraCompounds) {
            res.status(404).json({ error: "Extra compound not found" });
        }
        else {
            res.json(extraCompounds);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /extraCompounds
const createExtraCompound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = extraCompoundSchema.parse(body);
        const extraCompound = yield prisma.extraCompounds.create({
            data: validatedData,
        });
        res.status(201).json(extraCompound);
    }
    catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            res.status(400).json({ error: "Invalid request body" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
// PUT /extraCompounds/:id
const updateExtraCompound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = extraCompoundSchema.parse(body);
        const updatedExtraCompound = yield prisma.extraCompounds.update({
            where: {
                id,
            },
            data: validatedData,
        });
        res.json(updatedExtraCompound);
    }
    catch (error) {
        if (error instanceof Error && error.name === "ZodError") {
            res.status(400).json({ error: "Invalid request body" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
// DELETE /extraCompounds/:id
const deleteExtraCompound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.extraCompounds.delete({
            where: {
                id,
            },
        });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = {
    getAllExtraCompounds,
    getExtraCompoundById,
    createExtraCompound,
    updateExtraCompound,
    deleteExtraCompound,
    getExtraCompoundByProtocolId,
};
