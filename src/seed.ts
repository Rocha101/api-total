import {
  AccountType,
  ConcentrationUnit,
  ExerciseType,
  HormoneType,
  HormoneUnit,
  MealType,
  MealUnit,
  MuscleGroup,
  WeekDay,
} from "@prisma/client";
import { prisma } from "./server";

async function seed() {
  const coach = await prisma.account.create({
    data: {
      email: "coach@example.com",
      name: "João Silva",
      password: "senha123",
      accountType: AccountType.COACH,
    },
  });

  const customer = await prisma.account.create({
    data: {
      email: "customer@example.com",
      name: "Maria Souza",
      password: "senha123",
      accountType: AccountType.CUSTOMER,
      coachId: coach.id,
    },
  });

  // Seed trains
  const train = await prisma.train.create({
    data: {
      name: "Treino de Força",
      description: "Treino de força para o corpo inteiro",
      weekDays: [WeekDay.MONDAY, WeekDay.WEDNESDAY, WeekDay.FRIDAY],
      accountId: customer.id,
    },
  });

  // Seed exercises
  const exercise1 = await prisma.exercise.create({
    data: {
      name: "Supino",
      description: "Exercício composto para os músculos peitorais",
      type: ExerciseType.STRENGHT,
      muscleGroup: MuscleGroup.CHEST,
      trainId: train.id,
      accountId: customer.id,
    },
  });

  const exercise2 = await prisma.exercise.create({
    data: {
      name: "Levantamento Terra",
      description: "Exercício composto para os músculos do posterior",
      type: ExerciseType.STRENGHT,
      muscleGroup: MuscleGroup.BACK,
      trainId: train.id,
      accountId: customer.id,
    },
  });

  // Seed meals
  const breakfast = await prisma.meal.create({
    data: {
      name: "Café da Manhã Saudável",
      description: "Café da manhã nutritivo para começar o dia",
      mealType: MealType.BREAKFAST,
      accountId: customer.id,
    },
  });

  const lunch = await prisma.meal.create({
    data: {
      name: "Almoço Balanceado",
      description: "Almoço balanceado para energia durante o dia",
      mealType: MealType.LUNCH,
      accountId: customer.id,
    },
  });

  // Seed foods
  const eggs = await prisma.food.create({
    data: {
      name: "Ovos Mexidos",
      description: "Ovos mexidos preparados com vegetais",
      quantity: 200,
      unit: MealUnit.GR,
      calories: 300,
      proteins: 20,
      carbs: 5,
      fats: 15,
      mealId: breakfast.id,
      accountId: customer.id,
    },
  });

  const chickenBreast = await prisma.food.create({
    data: {
      name: "Peito de Frango Grelhado",
      description: "Peito de frango grelhado temperado com ervas",
      quantity: 150,
      unit: MealUnit.GR,
      calories: 200,
      proteins: 30,
      carbs: 0,
      fats: 5,
      mealId: lunch.id,
      accountId: customer.id,
    },
  });

  // Seed hormones
  const testosterone = await prisma.hormone.create({
    data: {
      name: "Testosterona",
      description: "Principal hormônio sexual masculino",
      quantity: 100,
      concentration: 10,
      unit: HormoneUnit.MG,
      concentrationUnit: ConcentrationUnit.MG,
      hormoneType: HormoneType.TESTOSTERONE,
      accountId: customer.id,
    },
  });

  // Seed diets
  const diet = await prisma.diet.create({
    data: {
      name: "Dieta Balanceada",
      description: "Dieta balanceada para objetivos específicos",
      accountId: customer.id,
    },
  });

  // Seed hormonal protocols
  const hormonalProtocol = await prisma.hormonalProtocol.create({
    data: {
      name: "Protocolo Hormonal",
      description: "Protocolo hormonal para otimizar resultados",
      accountId: customer.id,
    },
  });

  // Seed extra compounds
  const extraCompound = await prisma.extraCompounds.create({
    data: {
      name: "Creatina",
      description: "Suplemento para aumentar a força e o desempenho",
      quantity: 5,
      concentration: 500,
      unit: HormoneUnit.ML,
      concentrationUnit: ConcentrationUnit.MG_ML,
      accountId: customer.id,
    },
  });
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1); // Exit with non-zero code to indicate failure
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect Prisma client
  });
