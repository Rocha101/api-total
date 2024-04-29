import { Resend } from "resend";
import jwt from "jsonwebtoken";
import prisma from "../models/prisma";
import { Request, Response } from "express";
import { z } from "zod";

const resend = new Resend("re_6uRZC8rt_NKytMWr1cr48VxwSb3PWZgF1");

const recoverPasswordSchema = z.object({
  email: z.string().email(),
});

const newPasswordSchema = z.object({
  password: z.string().min(6),
});

const sendRecoverPasswordEmail = async (email: string) => {
  try {
    const account = await prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (!account) {
      return { error: "Account not found" };
    }

    const token = jwt.sign({ email }, "96172890", {
      expiresIn: "1h",
    });

    const sentEmail = await resend.emails.send({
      from: "suporte@iron-atlas.app",
      to: email,
      subject: "Recupere sua senha",
      html: `
        <p>Olá, clique no link abaixo para recuperar sua senha:</p>
        <a href="http://localhost:3000/new-password/${token}">Recuperar senha</a>
      `,
    });

    return { sentEmail };
  } catch (error) {
    return { error: "Internal server error" };
  }
};

// POST /
const recoverPassword = async (req: Request, res: Response) => {
  try {
    const validatedData = recoverPasswordSchema.parse(req.body);
    const { email } = validatedData;
    const { sentEmail, error } = await sendRecoverPasswordEmail(email);

    if (error || sentEmail?.error) {
      return res.status(404).json({
        error: error || sentEmail?.error,
      });
    }

    return res.json({ sentEmail });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// PUT new-password

const updatePassword = async (req: Request, res: Response) => {
  try {
    const { id: token } = req.params;
    const { password } = newPasswordSchema.parse(req.body);

    const decoded = jwt.verify(token as string, "96172890") as {
      email: string;
    };

    if (!decoded) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const newPassword = await prisma.account.update({
      where: {
        email: decoded.email,
      },
      data: {
        password,
      },
    });

    return res.json(newPassword);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default {
  recoverPassword,
  updatePassword,
};
