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
// Zod schema for validating the request body when creating or updating a meal
const mealSchema = (0, zod_1.object)({
    name: (0, zod_1.string)(),
    description: (0, zod_1.string)().optional(),
    mealType: (0, zod_1.enum)([
        "BREAKFAST",
        "MORNING_SNACK",
        "LUNCH",
        "AFTERNOON_SNACK",
        "DINNER",
    ]),
    totalCalories: (0, zod_1.number)().optional(),
    totalProteins: (0, zod_1.number)().optional(),
    totalCarbs: (0, zod_1.number)().optional(),
    totalFats: (0, zod_1.number)().optional(),
    dietId: (0, zod_1.string)().optional(),
    accountId: (0, zod_1.string)(),
    foods: (0, zod_1.string)().array().optional(),
});
// GET /meals
const getAllMeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const meals = yield prisma.meal.findMany({});
        res.json(meals);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// GET /meals/:id
const getMealById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const meal = yield prisma.meal.findUnique({
            where: {
                id,
            },
            include: {
                foods: true,
            },
        });
        if (!meal) {
            res.status(404).json({ error: "Meal not found" });
        }
        else {
            res.json(meal);
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
// POST /meals
const createMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = mealSchema.parse(body);
        const meal = yield prisma.meal.create({
            data: Object.assign(Object.assign({}, validatedData), { foods: {
                    connect: (_a = validatedData.foods) === null || _a === void 0 ? void 0 : _a.map((foodId) => ({
                        id: foodId,
                    })),
                } }),
        });
        res.status(201).json(meal);
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
// PUT /meals/:id
const updateMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    try {
        const accountId = yield (0, getAccountId_1.getAccountId)(req, res);
        const body = Object.assign(Object.assign({}, req.body), { accountId });
        const validatedData = mealSchema.parse(body);
        const updatedMeal = yield prisma.meal.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign({}, validatedData), { foods: {
                    connect: (_b = validatedData.foods) === null || _b === void 0 ? void 0 : _b.map((foodId) => ({
                        id: foodId,
                    })),
                } }),
        });
        res.json(updatedMeal);
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
// DELETE /meals/:id
const deleteMeal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.meal.delete({
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
    getAllMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal,
};
