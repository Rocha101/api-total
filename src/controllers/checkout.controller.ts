import type { Request, Response } from "express";
import prisma from "../models/prisma";
import { createCheckoutSession } from "../lib/stripe";

export const createCheckoutController = async (
  request: Request,
  response: Response
) => {
  const accountId = request.headers["x-user-id"];

  if (!accountId) {
    return response.status(403).send({
      error: "Not authorized",
    });
  }

  const user = await prisma.account.findUnique({
    where: {
      id: accountId as string,
    },
  });

  if (!user) {
    return response.status(403).send({
      error: "Not authorized",
    });
  }

  const checkout = await createCheckoutSession(user.id, user.email);

  return response.send(checkout);
};
