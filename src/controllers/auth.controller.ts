import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../models/prisma";
import { nativeEnum, object, string } from "zod";
import { AccountType } from "@prisma/client";

const registerSchema = object({
  name: string(),
  email: string().email(),
  password: string(),
  accountType: nativeEnum(AccountType),
  coachId: string().optional(),
});

const loginSchema = object({
  email: string().email(),
  password: string(),
});

const registerUser = async (req: Request, res: Response) => {
  console.log(req.body);
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
      data: validatedData,
    });

    console.log(newAccount);

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
      expiresIn: 4500, // expires in 45 minutes
    });

    res.status(200).json({ token, account });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  console.log(token);
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
  console.log(token);
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
