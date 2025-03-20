import { Request, Response } from "express";
import { ExerciseType, MuscleGroup, PrismaClient, SetType } from "@prisma/client";
import z, { object, string } from "zod";
import { getAccountId } from "../utils/getAccountId";
import notificationController from "./notification.controller";

const MealTypeEnum = z.enum(['BREAKFAST', 'MORNING_SNACK', 'LUNCH', 'AFTERNOON_SNACK', 'DINNER']);
const MealUnitEnum = z.enum(['GR', 'ML', 'UNIT']);
const ExerciseTypeEnum = z.enum(['CARDIO', 'STRETCHING', 'STRENGHT']);
const MuscleGroupEnum = z.enum([
  'CHEST', 'BACK', 'SHOULDERS', 'BICEPS', 'TRICEPS', 'FOREARMS', 'CALVES', 'ABS',
  'QUADS', 'HAMSTRINGS', 'GLUTES', 'ADDUCTORS', 'ABDUCTORS', 'TRAPS', 'LATS',
  'LOWER_BACK', 'OBLIQUES', 'NECK'
]);
const SetTypeEnum = z.enum(['WARM_UP', 'WORKING', 'FEEDER', 'TOP', 'BACK_OFF']);
const WeekDayEnum = z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
const HormoneTypeEnum = z.enum(['NINETEEN_NOR', 'DHT', 'TESTOSTERONE', 'PEPTIDE', 'INSULIN', 'TIREOID']);
const HormoneUnitEnum = z.enum(['MG', 'ML', 'UI', 'UNIT']);
const ConcentrationUnitEnum = z.enum(['MG_ML', 'MG']);

// Schema para cada entidade
const foodSchema = z.object({
  name: z.string(),
  quantity: z.number(),
  unit: MealUnitEnum,
  calories: z.number().optional(),
  proteins: z.number().optional(),
  carbs: z.number().optional(),
  fats: z.number().optional(),
});

const mealSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  mealType: MealTypeEnum,
  foods: z.array(foodSchema),
});

const dietSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  meals: z.array(mealSchema),
});

const repSchema = z.object({
  quantity: z.number(),
  weight: z.number(),
  setType: SetTypeEnum.optional(),
});

const setSchema = z.object({
  reps: z.array(repSchema),
});

const exerciseSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: ExerciseTypeEnum.optional(),
  muscleGroup: MuscleGroupEnum.optional(),
  equipment: z.string().optional(),
  sets: z.array(setSchema),
});

const trainSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  weekDays: z.array(WeekDayEnum),
  exercises: z.array(exerciseSchema),
});

const extraCompoundSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number(),
  concentration: z.number().optional(),
  unit: HormoneUnitEnum,
  concentrationUnit: ConcentrationUnitEnum.optional(),
});

const hormoneSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number(),
  concentration: z.number().optional(),
  unit: HormoneUnitEnum,
  concentrationUnit: ConcentrationUnitEnum.optional(),
  hormoneType: HormoneTypeEnum,
});

const hormonalProtocolSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  hormones: z.array(hormoneSchema),
});

// Schema principal
export const completeProtocolSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  clientId: z.string(),
  diet: dietSchema.optional(),
  trains: z.array(trainSchema).optional(),
  extraCompounds: z.array(extraCompoundSchema).optional(),
  hormonalProtocol: hormonalProtocolSchema.optional(),
});

const prisma = new PrismaClient();

// Zod schema for validating the request body when creating or updating a protocol
const protocolSchema = object({
  name: string(),
  description: string().optional(),
  accountId: string().optional(),
  clientId: string().optional(),
  diet: string().optional(),
  train: string().array().optional(),
  hormonalProtocol: string().optional(),
  extraCompound: string().array().optional(),
});

interface CreateFullProtocolData {
  name: string;
  description?: string;
  clientId: string;
  diet?: {
    name: string;
    description?: string;
    meals: {
      name: string;
      description?: string;
      mealType: 'BREAKFAST' | 'MORNING_SNACK' | 'LUNCH' | 'AFTERNOON_SNACK' | 'DINNER';
      foods: {
        name: string;
        quantity: number;
        unit: 'GR' | 'ML' | 'UNIT';
        calories?: number;
        proteins?: number;
        carbs?: number;
        fats?: number;
      }[];
    }[];
  };
  trains?: {
    name: string;
    description?: string;
    weekDays: ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY')[];
    exercises: {
      name: string;
      description?: string;
      type?: 'CARDIO' | 'STRETCHING' | 'STRENGHT';
      muscleGroup?: MuscleGroup | null;
      equipment?: string;
      sets: {
        reps: {
          quantity: number;
          weight: number;
          setType?: 'WARM_UP' | 'WORKING' | 'FEEDER' | 'TOP' | 'BACK_OFF';
        }[];
      }[];
    }[];
  }[];
  extraCompounds?: {
    name: string;
    description?: string;
    quantity: number;
    concentration?: number;
    unit: 'MG' | 'ML' | 'UI' | 'UNIT';
    concentrationUnit?: 'MG_ML' | 'MG';
  }[];
  hormonalProtocol?: {
    name: string;
    description?: string;
    hormones: {
      name: string;
      description?: string;
      quantity: number;
      concentration?: number;
      unit: 'MG' | 'ML' | 'UI' | 'UNIT';
      concentrationUnit?: 'MG_ML' | 'MG';
      hormoneType: 'NINETEEN_NOR' | 'DHT' | 'TESTOSTERONE' | 'PEPTIDE' | 'INSULIN' | 'TIREOID';
    }[];
  };
}

const createFullProtocol = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = completeProtocolSchema.parse(req.body) as CreateFullProtocolData;

    console.log('Iniciando transação para protocolo:', validatedData.name);

    // Create everything in a single transaction with nested creates
    const protocol = await prisma.protocol.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        account: { connect: { id: accountId } },
        clientId: validatedData.clientId,

        // Nested create for diet
        diets: validatedData.diet ? {
          create: {
            name: validatedData.diet.name,
            description: validatedData.diet.description,
            account: { connect: { id: accountId } },
            // Nested create for meals
            meals: {
              create: validatedData.diet.meals.map(meal => ({
                name: meal.name,
                description: meal.description,
                mealType: meal.mealType,
                account: { connect: { id: accountId } },
                // Nested create for foods
                foods: {
                  create: meal.foods.map(food => ({
                    name: food.name,
                    quantity: food.quantity,
                    unit: food.unit,
                    calories: food.calories,
                    proteins: food.proteins,
                    carbs: food.carbs,
                    fats: food.fats,
                    account: { connect: { id: accountId } },
                  }))
                }
              }))
            }
          }
        } : undefined,

        // Nested create for trains
        trains: validatedData.trains ? {
          create: validatedData.trains.map(train => ({
            name: train.name,
            description: train.description,
            weekDays: train.weekDays,
            account: { connect: { id: accountId } },
            // Nested create for exercises
            exercises: {
              create: train.exercises.map(exercise => ({
                name: exercise.name,
                description: exercise.description,
                type: exercise.type,
                muscleGroup: exercise.muscleGroup,
                equipment: exercise.equipment,
                account: { connect: { id: accountId } },
                // Nested create for sets
                sets: {
                  create: exercise.sets.map(set => ({
                    // Nested create for reps
                    reps: {
                      create: set.reps.map(rep => ({
                        quantity: rep.quantity,
                        weight: rep.weight,
                        setType: rep.setType,
                      }))
                    }
                  }))
                }
              }))
            }
          }))
        } : undefined,

        // Nested create for extra compounds
        extraCompounds: validatedData.extraCompounds ? {
          create: validatedData.extraCompounds.map(compound => ({
            name: compound.name,
            description: compound.description,
            quantity: compound.quantity,
            concentration: compound.concentration,
            unit: compound.unit,
            concentrationUnit: compound.concentrationUnit,
            account: { connect: { id: accountId } },
          }))
        } : undefined,

        // Nested create for hormonal protocol
        hormonalProtocols: validatedData.hormonalProtocol ? {
          create: {
            name: validatedData.hormonalProtocol.name,
            description: validatedData.hormonalProtocol.description,
            account: { connect: { id: accountId } },
            // Nested create for hormones
            hormones: {
              create: validatedData.hormonalProtocol.hormones.map(hormone => ({
                name: hormone.name,
                description: hormone.description,
                quantity: hormone.quantity,
                concentration: hormone.concentration,
                unit: hormone.unit,
                concentrationUnit: hormone.concentrationUnit,
                hormoneType: hormone.hormoneType,
                account: { connect: { id: accountId } },
              }))
            }
          }
        } : undefined,
      },
      // Include all related data in the response
      include: {
        diets: {
          include: {
            meals: {
              include: {
                foods: true
              }
            }
          }
        },
        trains: {
          include: {
            exercises: {
              include: {
                sets: {
                  include: {
                    reps: true
                  }
                }
              }
            }
          }
        },
        hormonalProtocols: {
          include: {
            hormones: true
          }
        },
        extraCompounds: true
      }
    });

    console.log('Protocolo criado com ID:', protocol.id);

    // Create notification after successful protocol creation
    console.log('Criando notificação...');
    await notificationController.createNotification({
      title: "Novo protocolo completo atribuído a você",
      message: `O protocolo ${protocol.name} foi atribuído a você com todos os componentes`,
      accountId: validatedData.clientId,
    });

    res.status(201).json(protocol);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      console.error('Erro de validação Zod:', error.message);
      res.status(400).json({ error: "Invalid request body", details: error.message });
    } else {
      console.error('Erro durante a transação:', error);
      res.status(500).json({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }
};

// GET /protocols
const getAllProtocols = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const protocols = await prisma.protocol.findMany({
      where: {
        accountId,
      },
      include: {
        diets: true,
        trains: true,
        hormonalProtocols: true,
        extraCompounds: true,
      },
    });
    res.json(protocols);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProtocolsCount = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const count = await prisma.protocol.count({
      where: {
        accountId,
      },
    });
    res.json(count);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /protocols/:id
const getProtocolById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const protocol = await prisma.protocol.findUnique({
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
    } else {
      res.json(protocol);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProtocolByClientId = async (req: Request, res: Response) => {
  const { clientId } = req.params;
  try {
    const protocol = await prisma.protocol.findMany({
      where: {
        clientId: clientId as string,
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
    } else {
      res.json(protocol[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /protocols
const createProtocol = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = protocolSchema.parse(req.body);
    const protocol = await prisma.protocol.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        account: {
          connect: {
            id: accountId,
          },
        },
        clientId: validatedData.clientId,
        ...(validatedData.diet && {
          diets: {
            connect: {
              id: validatedData.diet,
            },
          },
        }),
        ...(validatedData.train && {
          trains: {
            connect: validatedData.train.map((id: string) => ({
              id: id,
            })),
          },
        }),
        ...(validatedData.extraCompound && {
          extraCompounds: {
            connect: validatedData.extraCompound.map((id: string) => ({
              id: id,
            })),
          },
        }),
        ...(validatedData.hormonalProtocol && {
          hormonalProtocols: {
            connect: {
              id: validatedData.hormonalProtocol,
            },
          },
        }),
      },
    });

    await notificationController.createNotification({
      title: "Novo protocolo atribuido a você",
      message: `O protocolo ${protocol.name} foi atribuido a você`,
      accountId: validatedData.clientId as string,
    });

    res.status(201).json(protocol);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// PUT /protocols/:id
const updateProtocol = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const accountId = await getAccountId(req, res);
    const validatedData = protocolSchema.parse(req.body);
    const updatedProtocol = await prisma.protocol.update({
      where: {
        id,
      },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        clientId: validatedData.clientId,
        account: {
          connect: {
            id: accountId,
          },
        },
        ...(validatedData.diet && {
          diets: {
            set: {
              id: validatedData.diet,
            },
          },
        }),
        ...(validatedData.train && {
          trains: {
            set: validatedData.train.map((id: string) => ({
              id: id,
            })),
          },
        }),
        ...(validatedData.extraCompound && {
          extraCompounds: {
            set: validatedData.extraCompound.map((id: string) => ({
              id: id,
            })),
          },
        }),
        ...(validatedData.hormonalProtocol && {
          hormonalProtocols: {
            set: {
              id: validatedData.hormonalProtocol,
            },
          },
        }),
      },
    });

    await notificationController.createNotification({
      title: "Protocolo atualizado",
      message: `O seu protocolo foi atualizado`,
      accountId: validatedData.clientId as string,
    });

    res.json(updatedProtocol);
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      res.status(400).json({ error: "Invalid request body" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// DELETE /protocols/:id
const deleteProtocol = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.protocol.delete({
      where: {
        id,
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  getAllProtocols,
  getProtocolById,
  createProtocol,
  updateProtocol,
  deleteProtocol,
  getProtocolByClientId,
  getProtocolsCount,
  createFullProtocol
};
