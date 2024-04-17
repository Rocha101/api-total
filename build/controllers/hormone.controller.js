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
// Zod schema for validating the request body when creating or updating a hormone
const hormoneSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    description: (0, zod_1.string)().optional(),
    quantity: (0, zod_1.number)(),
    unit: (0, zod_1.enum)(["MG", "ML", "UI", "UNIT"]),
    concentration: (0, zod_1.number)().optional(),
    concentrationUnit: (0, zod_1.enum)(["MG_ML", "MG"]).optional(),
    hormoneType: (0, zod_1.enum)([
        "NINETEEN_NOR",
        "DHT",
        "TESTOSTERONE",
        "PEPTIDE",
        "INSULIN",
        "TIREOID",
    ]),
    protocolId: (0, zod_1.string)().optional(),
    accountId: (0, zod_1.string)().optional(),
});
// GET /hormones
const getAllHormones = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const hormones = yield prisma.hormone.findMany({
            where: {
                accountId,
            },
        });
        res.json(hormones);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /hormones/:id
const getHormoneById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const hormone = yield prisma.hormone.findUnique({
            where: {
                id,
            },
        });
        if (!hormone) {
            res.status(404).json({ error: "Hormone not found" });
        }
        else {
            res.json(hormone);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /hormones
const createHormone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = hormoneSchema.parse(body);
        const hormone = yield prisma.hormone.create({
            data: validatedData,
        });
        res.status(201).json(hormone);
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
// PUT /hormones/:id
const updateHormone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = hormoneSchema.parse(body);
        const updatedHormone = yield prisma.hormone.update({
            where: {
                id,
            },
            data: validatedData,
        });
        res.json(updatedHormone);
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
// DELETE /hormones/:id
const deleteHormone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.hormone.delete({
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
    getAllHormones,
    getHormoneById,
    createHormone,
    updateHormone,
    deleteHormone,
};
