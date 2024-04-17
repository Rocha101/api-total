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
// Zod schema for validating the request body when creating or updating a food
const foodSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    description: (0, zod_1.string)().optional(),
    quantity: (0, zod_1.number)().optional(),
    unit: (0, zod_1.enum)(["GR", "ML", "UNIT"]).optional(),
    calories: (0, zod_1.number)().optional(),
    proteins: (0, zod_1.number)().optional(),
    carbs: (0, zod_1.number)().optional(),
    fats: (0, zod_1.number)().optional(),
    mealId: (0, zod_1.string)().optional(),
    accountId: (0, zod_1.string)(),
});
// GET /foods
const getAllFoods = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foods = yield prisma.food.findMany({});
        res.json(foods);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /foods/:id
const getFoodById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const food = yield prisma.food.findUnique({
            where: {
                id,
            },
        });
        if (!food) {
            res.status(404).json({ error: "Food not found" });
        }
        else {
            res.json(food);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /foods
const createFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = foodSchema.parse(body);
        const food = yield prisma.food.create({
            data: validatedData,
        });
        res.status(201).json(food);
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
// PUT /foods/:id
const updateFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = foodSchema.parse(body);
        const updatedFood = yield prisma.food.update({
            where: {
                id,
            },
            data: validatedData,
        });
        res.json(updatedFood);
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
// DELETE /foods/:id
const deleteFood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.food.delete({
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
    getAllFoods,
    getFoodById,
    createFood,
    updateFood,
    deleteFood,
};
