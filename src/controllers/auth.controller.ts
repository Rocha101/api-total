import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { IssueData, nativeEnum, object, string } from "zod";
import { AccountType } from "@prisma/client";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";
import { createDirectNotification } from "./notification.controller";

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

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email } = validatedData;

    const existingUser = await prisma.account.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Email já cadastrado", 400);
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

    await createDirectNotification({
      title: "Bem-vindo ao Iron Atlas",
      message: "Seja bem-vindo ao Iron Atlas, a plataforma de bodybuilding mais completa do mercado",
      accountId: newAccount.id,
      type: "WELCOME",
    });

    if (newAccount.accountType === "CUSTOMER") {
      await createDirectNotification({
        title: `Novo cliente cadastrado: ${newAccount.name}`,
        message: `O cliente ${newAccount.name} acabou de se cadastrar no Iron Atlas`,
        accountId: newAccount.coachId as string,
        type: "NEW_CLIENT",
      });
    }

    const token = jwt.sign({ account: newAccount }, process.env.JWT_SECRET || "96172890", {
      expiresIn: 4500, // expires in 45 minutes
    });

    return ApiResponse.created(res, { token, account: newAccount });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const account = await prisma.account.findUnique({
      where: { email },
    });

    if (!account) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    if (account.password !== password) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    const token = jwt.sign({ account }, process.env.JWT_SECRET || "96172890", {
      expiresIn: 4500,
    });

    return ApiResponse.success(res, { token, account });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("Token não fornecido", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "96172890");
    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Token inválido", 401));
  }
};

export const verify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return ApiResponse.success(res, { user: req.user });
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
  loginUser,
  verifyToken,
  verify,
};
