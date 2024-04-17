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
exports.populateFoods = void 0;
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
// Function to generate random food data
const generateRandomFood = () => {
    return {
        name: faker_1.faker.commerce.productName(),
        description: faker_1.faker.lorem.sentence(),
        quantity: Math.floor(Math.random() * 1000),
        calories: Math.floor(Math.random() * 1000),
        proteins: Math.floor(Math.random() * 1000),
        carbs: Math.floor(Math.random() * 1000),
        fats: Math.floor(Math.random() * 1000),
    };
};
// Function to populate foods
const populateFoods = (count) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foods = Array.from({ length: count }, () => generateRandomFood());
        yield prisma.food.createMany({
            data: foods,
        });
        console.log(`Successfully populated ${count} foods.`);
    }
    catch (error) {
        console.error("Error populating foods:", error);
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.populateFoods = populateFoods;
