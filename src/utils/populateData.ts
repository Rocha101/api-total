import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

// Function to generate random food data
const generateRandomFood = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    quantity: Math.floor(Math.random() * 1000),
    calories: Math.floor(Math.random() * 1000),
    proteins: Math.floor(Math.random() * 1000),
    carbs: Math.floor(Math.random() * 1000),
    fats: Math.floor(Math.random() * 1000),
  };
};

// Function to populate foods
export const populateFoods = async (count: number) => {
  try {
    const foods = Array.from({ length: count }, () => generateRandomFood());
    await prisma.food.createMany({
      data: foods,
    });
    console.log(`Successfully populated ${count} foods.`);
  } catch (error) {
    console.error("Error populating foods:", error);
  } finally {
    await prisma.$disconnect();
  }
};
