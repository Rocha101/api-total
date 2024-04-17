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
// Zod schema for validating the request body when creating or updating a diet
const dietSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    description: (0, zod_1.string)().optional(),
    protocolId: (0, zod_1.string)().optional(),
    accountId: (0, zod_1.string)(),
    meals: (0, zod_1.string)().array(),
});
// GET /diets
const getAllDiets = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const diets = yield prisma.diet.findMany({
            where: {
                accountId,
            },
            include: {
                meals: true,
            },
        });
        res.json(diets);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /diets/:id
const getDietById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const diet = yield prisma.diet.findUnique({
            where: {
                id,
            },
            include: {
                meals: {
                    include: {
                        foods: true,
                    },
                },
            },
        });
        if (!diet) {
            res.status(404).json({ error: "Diet not found" });
        }
        else {
            res.json(diet);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
const getDietByProtocolId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { protocolId } = req.params;
    try {
        const diets = yield prisma.diet.findMany({
            where: {
                protocolId,
            },
            include: {
                meals: {
                    include: {
                        foods: true,
                    },
                },
            },
        });
        if (!diets) {
            res.status(404).json({ error: "Diet not found" });
        }
        else {
            res.json(diets);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /diets
const createDiet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = dietSchema.parse(body);
        const diet = yield prisma.diet.create({
            data: Object.assign(Object.assign({}, validatedData), { meals: {
                    connect: validatedData.meals.map((mealId) => ({
                        id: mealId,
                    })),
                } }),
        });
        res.status(201).json(diet);
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
// PUT /diets/:id
const updateDiet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = dietSchema.parse(body);
        const existingDiet = yield prisma.diet.findUnique({
            where: { id },
            include: { meals: true }, // Include associated meals
        });
        if (!existingDiet) {
            res.status(404).json({ error: "Diet not found" });
            return;
        }
        // Extract mealIds from existing diet
        const existingMealIds = existingDiet.meals.map((meal) => meal.id);
        // Find meals to disconnect
        const mealsToDisconnect = existingMealIds.filter((mealId) => !validatedData.meals.includes(mealId));
        const updatedDiet = yield prisma.diet.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign({}, validatedData), { meals: {
                    disconnect: mealsToDisconnect.map((mealId) => ({
                        id: mealId,
                    })),
                    connect: validatedData.meals.map((mealId) => ({
                        id: mealId,
                    })),
                } }),
        });
        res.json(updatedDiet);
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
// DELETE /diets/:id
const deleteDiet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.diet.delete({
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
    getAllDiets,
    getDietById,
    createDiet,
    updateDiet,
    deleteDiet,
    getDietByProtocolId,
};
