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
const client_2 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Zod schema for validating the request body when creating or updating a train
const trainSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    description: (0, zod_1.string)().optional(),
    exercises: (0, zod_1.string)().array(),
    weekDays: (0, zod_1.nativeEnum)(client_2.WeekDay).array().optional(),
    accountId: (0, zod_1.string)(),
    protocolId: (0, zod_1.string)().optional(),
});
// GET /trains
const getAllTrains = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const trains = yield prisma.train.findMany({
            where: {
                accountId,
            },
            include: {
                exercises: {
                    include: {
                        sets: {
                            include: {
                                reps: true,
                            },
                        },
                    },
                },
            },
        });
        res.json(trains);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /trains/:id
const getTrainById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const train = yield prisma.train.findUnique({
            where: {
                id,
            },
            include: {
                exercises: {
                    include: {
                        sets: {
                            include: {
                                reps: true,
                            },
                        },
                    },
                },
            },
        });
        if (!train) {
            res.status(404).json({ error: "Train not found" });
        }
        else {
            res.json(train);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
const getTrainByProtocolId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { protocolId } = req.params;
    try {
        const train = yield prisma.train.findMany({
            where: {
                protocolId,
            },
            include: {
                exercises: {
                    include: {
                        sets: {
                            include: {
                                reps: true,
                            },
                        },
                    },
                },
            },
        });
        if (!train) {
            res.status(404).json({ error: "Train not found" });
        }
        else {
            res.json(train);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /trains
const createTrain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = trainSchema.parse(body);
        const train = yield prisma.train.create({
            data: Object.assign(Object.assign({}, validatedData), { exercises: {
                    connect: validatedData.exercises.map((exerciseId) => ({
                        id: exerciseId,
                    })),
                } }),
        });
        res.status(201).json(train);
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
// PUT /trains/:id
const updateTrain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = trainSchema.parse(body);
        const updatedTrain = yield prisma.train.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign({}, validatedData), { exercises: {
                    set: validatedData.exercises.map((exerciseId) => ({
                        id: exerciseId,
                    })),
                } }),
        });
        res.json(updatedTrain);
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
// DELETE /trains/:id
const deleteTrain = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.train.delete({
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
    getAllTrains,
    getTrainById,
    createTrain,
    updateTrain,
    deleteTrain,
    getTrainByProtocolId,
};
