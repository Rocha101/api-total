import type { Request, Response } from "express";
import prisma from "../models/prisma";
import { createCheckoutSession } from "../lib/stripe";
import { getAccountId } from "../utils/getAccountId";

export const createCheckoutController = async (
  request: Request,
  response: Response
) => {
  const accountId = await getAccountId(request, response);

  if (!accountId) {
    return response.status(403).json({
      error: "Not authorized",
    });
  }

  const user = await prisma.account.findUnique({
    where: {
      id: accountId as string,
    },
  });

  if (!user) {
    return response.status(403).json({
      error: "Not authorized",
    });
  }

  const checkout = await createCheckoutSession(user.id, user.email);

  return response.status(200).json({ data: checkout });
};
