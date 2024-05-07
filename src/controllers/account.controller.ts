import { Request, Response } from "express";
import prisma from "../models/prisma";
import { getAccountId } from "../utils/getAccountId";
import { nativeEnum, object, string } from "zod";
import { AccountType } from "@prisma/client";

const accountSchema = object({
  name: string(),
  email: string().email(),
  password: string(),
  accountType: nativeEnum(AccountType),
  activationKey: string().optional(),
  accountImageUrl: string().optional(),
});

const updateAccountSchema = object({
  name: string().optional(),
  email: string().email().optional(),
  password: string().optional(),
  activationKey: string().optional(),
  accountImageUrl: string().optional(),
});

const getAccount = async (req: Request, res: Response) => {
  try {
    const allAccount = await prisma.account.findMany({});
    res.status(200).json(allAccount);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const getAccountById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
    });
    res.status(200).json(account);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const getClientsByCoachId = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);

    const account = await prisma.account.findMany({
      where: {
        coachId: accountId,
      },
    });
    res.status(200).json(account);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const getClientsCountByCoachId = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);

    const account = await prisma.account.count({
      where: {
        coachId: accountId,
      },
    });
    res.status(200).json(account);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const updateAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateAccountSchema.parse(req.body);

    if (validatedData.activationKey) {
      const currentSubscription = await prisma.account.findUnique({
        where: {
          id,
        },
        include: {
          subscriptions: true,
        },
      });

      if (currentSubscription?.subscriptions.length) {
        await prisma.account.update({
          where: {
            id,
          },
          data: {
            subscriptions: {
              disconnect: {
                id: currentSubscription.subscriptions[0].id,
              },
            },
          },
        });
      }
    }

    const updatedAccount = await prisma.account.update({
      where: {
        id,
      },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.password && { password: validatedData.password }),
        ...(validatedData.accountImageUrl && {
          accountImageUrl: validatedData.accountImageUrl,
        }),
        ...(validatedData.activationKey && {
          subscriptions: {
            connect: {
              id: validatedData.activationKey,
            },
          },
        }),
      },
    });

    res.status(200).json(updatedAccount);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteNotifications = await prisma.notification.deleteMany({
      where: {
        accountId: id,
      },
    });

    const deletedAccount = await prisma.account.delete({
      where: {
        id,
      },
    });
    res.status(200).json(deletedAccount);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export default {
  getAccount,
  getAccountById,
  updateAccount,
  deleteAccount,
  getClientsByCoachId,
  getClientsCountByCoachId,
};
