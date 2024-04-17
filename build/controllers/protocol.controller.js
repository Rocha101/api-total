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
// Zod schema for validating the request body when creating or updating a protocol
const protocolSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    description: (0, zod_1.string)().optional(),
    accountId: (0, zod_1.string)().optional(),
    clientId: (0, zod_1.string)().optional(),
    diet: (0, zod_1.string)().optional(),
    train: (0, zod_1.string)().array().optional(),
    hormonalProtocol: (0, zod_1.string)().optional(),
    extraCompound: (0, zod_1.string)().optional(),
});
// GET /protocols
const getAllProtocols = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const protocols = yield prisma.protocol.findMany({
            include: {
                diets: true,
                trains: true,
                hormonalProtocols: true,
                extraCompounds: true,
            },
        });
        res.json(protocols);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /protocols/:id
const getProtocolById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const protocol = yield prisma.protocol.findUnique({
            where: {
                id,
            },
            include: {
                diets: true,
                trains: true,
                hormonalProtocols: true,
                extraCompounds: true,
            },
        });
        if (!protocol) {
            res.status(404).json({ error: "Protocol not found" });
        }
        else {
            res.json(protocol);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
const getProtocolByClientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { clientId } = req.params;
    try {
        const protocol = yield prisma.protocol.findMany({
            where: {
                clientId: clientId,
            },
            include: {
                diets: true,
                trains: true,
                hormonalProtocols: true,
                extraCompounds: true,
            },
        });
        if (!protocol) {
            res.status(404).json({ error: "Protocol not found" });
        }
        else {
            res.json(protocol[0]);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /protocols
const createProtocol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign({}, req.body);
        const validatedData = protocolSchema.parse(body);
        const protocol = yield prisma.protocol.create({
            data: Object.assign(Object.assign(Object.assign(Object.assign({ name: validatedData.name, description: validatedData.description, accountId, clientId: validatedData.clientId }, (validatedData.extraCompound && {
                extraCompounds: {
                    connect: {
                        id: validatedData.extraCompound,
                    },
                },
            })), (validatedData.diet && {
                diets: {
                    connect: {
                        id: validatedData.diet,
                    },
                },
            })), (validatedData.train && {
                trains: {
                    connect: validatedData.train.map((trainId) => ({
                        id: trainId,
                    })),
                },
            })), (validatedData.hormonalProtocol && {
                hormonalProtocols: {
                    connect: {
                        id: validatedData.hormonalProtocol,
                    },
                },
            })),
        });
        res.status(201).json(protocol);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error && error.name === "ZodError") {
            res.status(400).json({ error: "Invalid request body" });
        }
        else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});
// PUT /protocols/:id
const updateProtocol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = protocolSchema.parse(body);
        const updatedProtocol = yield prisma.protocol.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign(Object.assign(Object.assign({ name: validatedData.name, description: validatedData.description, accountId, clientId: validatedData.clientId }, (validatedData.extraCompound && {
                extraCompounds: {
                    connect: {
                        id: validatedData.extraCompound,
                    },
                },
            })), (validatedData.diet && {
                diets: {
                    connect: {
                        id: validatedData.diet,
                    },
                },
            })), (validatedData.train && {
                trains: {
                    connect: validatedData.train.map((mealId) => ({
                        id: mealId,
                    })),
                },
            })), (validatedData.hormonalProtocol && {
                hormonalProtocols: {
                    connect: {
                        id: validatedData.hormonalProtocol,
                    },
                },
            })),
        });
        res.json(updatedProtocol);
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
// DELETE /protocols/:id
const deleteProtocol = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.protocol.delete({
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
    getAllProtocols,
    getProtocolById,
    createProtocol,
    updateProtocol,
    deleteProtocol,
    getProtocolByClientId,
};
