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
// Zod schema for validating the request body when creating or updating a hormonal protocol
const hormonalProtocolSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    description: (0, zod_1.string)().optional(),
    protocolId: (0, zod_1.string)().optional(),
    accountId: (0, zod_1.string)().optional(),
    hormones: (0, zod_1.string)().array(),
});
// GET /hormonalProtocols
const getAllHormonalProtocols = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const hormonalProtocols = yield prisma.hormonalProtocol.findMany({
            where: {
                accountId,
            },
            include: {
                hormones: true,
            },
        });
        res.json(hormonalProtocols);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /hormonalProtocols/:id
const getHormonalProtocolById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const hormonalProtocol = yield prisma.hormonalProtocol.findUnique({
            where: {
                id,
            },
            include: {
                hormones: true,
            },
        });
        if (!hormonalProtocol) {
            res.status(404).json({ error: "Hormonal protocol not found" });
        }
        else {
            res.json(hormonalProtocol);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
const getHormonalProtocolByProtocolId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { protocolId } = req.params;
    try {
        const hormonalProtocols = yield prisma.hormonalProtocol.findMany({
            where: {
                protocolId,
            },
            include: {
                hormones: true,
            },
        });
        res.json(hormonalProtocols);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /hormonalProtocols
const createHormonalProtocol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = hormonalProtocolSchema.parse(body);
        const hormonalProtocol = yield prisma.hormonalProtocol.create({
            data: Object.assign(Object.assign({}, validatedData), { hormones: {
                    connect: validatedData.hormones.map((id) => ({ id })),
                } }),
        });
        res.status(201).json(hormonalProtocol);
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
// PUT /hormonalProtocols/:id
const updateHormonalProtocol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = hormonalProtocolSchema.parse(body);
        const updatedHormonalProtocol = yield prisma.hormonalProtocol.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign({}, validatedData), { hormones: {
                    connect: validatedData.hormones.map((id) => ({ id })),
                } }),
        });
        res.json(updatedHormonalProtocol);
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
// DELETE /hormonalProtocols/:id
const deleteHormonalProtocol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.hormonalProtocol.delete({
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
    getAllHormonalProtocols,
    getHormonalProtocolById,
    createHormonalProtocol,
    updateHormonalProtocol,
    deleteHormonalProtocol,
    getHormonalProtocolByProtocolId,
};
