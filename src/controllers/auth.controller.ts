import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../models/prisma";
import { IssueData, nativeEnum, object, string } from "zod";
import { AccountType } from "@prisma/client";
import notificationController from "./notification.controller";

const registerSchema = object({
  name: string(),
  email: string().email(),
  password: string(),
  accountType: nativeEnum(AccountType),
  coachId: string().optional(),
  activationKey: string().optional(),
}).superRefine((data, refinementContext) => {
  if (data.accountType === "COACH" && !data.activationKey) {
    return refinementContext.addIssue({
      path: ["activationKey"],
      message: "Chave de ativação obrigatória",
      code: "invalid_literal",
    } as IssueData);
  }
  if (data.accountType === "CUSTOMER" && !data.coachId) {
    return refinementContext.addIssue({
      path: ["coachId"],
      message: "Código do coach obrigatório",
      code: "invalid_literal",
    } as IssueData);
  }
  return true;
});

const loginSchema = object({
  email: string().email(),
  password: string(),
});

const registerUser = async (req: Request, res: Response) => {
  try {
    let validatedData = registerSchema.parse(req.body);
    const { email } = validatedData;

    const user = await prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      res.status(400).json({ error: "Email já cadastrado" });
      return;
    }

    const newAccount = await prisma.account.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        accountType: validatedData.accountType,
        ...(validatedData.coachId && { coachId: validatedData.coachId }),
        ...(validatedData.activationKey && {
          subscriptions: {
            connect: {
              id: validatedData.activationKey,
            },
          },
        }),
      },
    });

    await notificationController.createNotification({
      title: "Bem-vindo ao Iron Atlas",
      message:
        "Seja bem-vindo ao Iron Atlas, a plataforma de bodybuilding mais completa do mercado",
      accountId: newAccount.id,
    });

    if (newAccount.accountType === "CUSTOMER") {
      await notificationController.createNotification({
        title: `Novo cliente cadastrado: ${newAccount.name}`,
        message: `O cliente ${newAccount.name} acabou de se cadastrar no Iron Atlas`,
        accountId: newAccount.coachId as string,
      });
    }

    const token = jwt.sign({ account: newAccount }, "96172890", {
      expiresIn: 4500, // expires in 45 minutes
    });

    res.status(200).json({ token, account: newAccount });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const account = await prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (!account || account.password !== password) {
      res.status(400).json({ error: "Credenciais inválidas" });
      return;
    }

    const token = jwt.sign({ account }, "96172890", {
      expiresIn: 60 * 60 * 6, // expires in 6 hours
    });

    res.status(200).json({ token, account });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(400).json({ error: "Token não encontrado" });
    return;
  }
  try {
    const decoded = jwt.verify(token, "96172890") as any;
    req.headers["account-id"] = decoded.account.id;
    next();
  } catch (e) {
    res.status(400).json({ error: "Token inválido" });
  }
};

const verify = async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(400).json({ error: "Token não encontrado" });
    return;
  }
  try {
    const decoded = jwt.verify(token, "96172890") as any;
    res.status(200).json({ account: decoded.account });
  } catch (e) {
    res.status(400).json({ error: "Token inválido" });
  }
};

export default { registerUser, loginUser, verifyToken, verify };
