import { Request, Response } from "express";

export const getAccountId = async (
  req: Request,
  res: Response
): Promise<string | undefined> => {
  let accountId = req.headers["account-id"];
  if (!accountId) {
    res.status(400).json({ error: "Account id not found" });
    return;
  }
  if (Array.isArray(accountId)) {
    accountId = accountId[0];
  }
  return accountId;
};
