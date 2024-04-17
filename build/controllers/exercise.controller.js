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
// Define Zod schema for request body validation
const exerciseSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.nativeEnum(client_1.ExerciseType).optional(),
    muscleGroup: zod_1.z.nativeEnum(client_1.MuscleGroup).optional(),
    equipment: zod_1.z.string().optional(),
    accountId: zod_1.z.string(),
    sets: zod_1.z.array(zod_1.z.object({
        quantity: zod_1.z.number().int(),
        weight: zod_1.z.number().optional(),
        setType: zod_1.z.nativeEnum(client_1.SetType).optional(),
    })),
});
// GET /exercises
const getAllExercises = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const exercises = yield prisma.exercise.findMany({
            where: {
                accountId,
            },
            include: {
                sets: {
                    include: {
                        reps: true,
                    },
                },
                train: true,
                account: true,
            },
        });
        res.json(exercises);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /exercises/:id
const getExerciseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const exercise = yield prisma.exercise.findUnique({
            where: {
                id,
            },
            include: {
                sets: {
                    include: {
                        reps: true,
                    },
                },
                train: true,
                account: true,
            },
        });
        if (!exercise) {
            res.status(404).json({ error: "Exercise not found" });
        }
        else {
            res.json(exercise);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /exercises
const createExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const exerciseData = exerciseSchema.parse(body);
        // Create Exercise
        const exercise = yield prisma.exercise.create({
            data: {
                name: exerciseData.name,
                description: exerciseData.description,
                type: exerciseData.type,
                muscleGroup: exerciseData.muscleGroup,
                equipment: exerciseData.equipment,
                account: { connect: { id: exerciseData.accountId } },
                sets: {
                    create: exerciseData.sets.map((set) => ({
                        reps: {
                            create: set,
                        },
                    })),
                },
            },
            include: { sets: { include: { reps: true } } },
        });
        res.json(exercise);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error("Validation failed:", error);
            res
                .status(400)
                .json({ error: "Validation Error", details: error.errors });
        }
        else {
            console.error("Error creating Exercise:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});
// PUT /exercises/:id
const updateExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const exerciseData = exerciseSchema.parse(body);
        const exercise = yield prisma.exercise.update({
            where: {
                id,
            },
            data: {
                name: exerciseData.name,
                description: exerciseData.description,
                type: exerciseData.type,
                muscleGroup: exerciseData.muscleGroup,
                equipment: exerciseData.equipment,
                account: { connect: { id: exerciseData.accountId } },
                sets: {
                    create: exerciseData.sets.map((set) => ({
                        reps: {
                            create: set.reps.map((rep) => ({
                                quantity: rep.quantity,
                                weight: rep.weight,
                                setType: rep.setType,
                            })),
                        },
                    })),
                },
            },
            include: { sets: { include: { reps: true } } },
        });
        res.json(exercise);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            console.error("Validation failed:", error);
            res
                .status(400)
                .json({ error: "Validation Error", details: error.errors });
        }
        else {
            console.error("Error creating Exercise:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});
// DELETE /exercises/:id
const deleteExercise = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.reps.deleteMany({
            where: {
                sets: {
                    exerciseId: id,
                },
            },
        });
        yield prisma.sets.deleteMany({
            where: {
                exerciseId: id,
            },
        });
        yield prisma.exercise.delete({
            where: {
                id,
            },
        });
        res.status(204).send();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = {
    getAllExercises,
    getExerciseById,
    createExercise,
    updateExercise,
    deleteExercise,
};
