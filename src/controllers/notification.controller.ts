import { Request, Response } from "express";
import prisma from "../models/prisma";
import { getAccountId } from "../utils/getAccountId";

const createNotification = async ({
  title,
  message,
  accountId,
  read = false,
}: {
  title: string;
  message: string;
  accountId: string;
  read?: boolean;
}) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        account: {
          connect: {
            id: accountId,
          },
        },
        title,
        message,
        read,
      },
    });

    return notification;
  } catch (e) {
    throw e;
  }
};

const getNotificationsByAccountId = async (req: Request, res: Response) => {
  try {
    const accountId = await getAccountId(req, res);
    const notifications = await prisma.notification.findMany({
      where: {
        accountId,
      },
    });

    return res.status(200).json(notifications);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

const updateNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const notification = await prisma.notification.update({
      where: {
        id,
      },
      data: {
        read,
      },
    });

    return res.status(200).json(notification);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "Notification deleted" });
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

export default {
  createNotification,
  getNotificationsByAccountId,
  updateNotification,
  deleteNotification,
};
