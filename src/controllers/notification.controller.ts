import { Request, Response, NextFunction } from "express";
import { object, string, boolean } from "zod";
import { getAccountId } from "../utils/getAccountId";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

const notificationSchema = object({
  title: string(),
  message: string(),
  type: string(),
  accountId: string(),
  read: boolean().optional(),
});

export const getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const notifications = await prisma.notification.findMany({
      where: { accountId },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return ApiResponse.success(res, notifications);
  } catch (error) {
    next(error);
  }
};

export const getNotificationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    return ApiResponse.success(res, notification);
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = notificationSchema.parse(req.body);

    const notification = await prisma.notification.create({
      data: validatedData,
    });

    return ApiResponse.created(res, notification);
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const validatedData = notificationSchema.parse(req.body);

    const notification = await prisma.notification.update({
      where: { id },
      data: validatedData,
    });

    return ApiResponse.success(res, notification, "Notification updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.notification.delete({
      where: { id },
    });

    return ApiResponse.success(res, null, "Notification deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const notification = await prisma.notification.update({
      where: { id },
      data: { read: true },
    });

    return ApiResponse.success(res, notification, "Notification marked as read");
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    await prisma.notification.updateMany({
      where: { 
        accountId,
        read: false,
      },
      data: { read: true },
    });

    return ApiResponse.success(res, null, "All notifications marked as read");
  } catch (error) {
    next(error);
  }
};

export const getUnreadNotificationsCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = await getAccountId(req, res);
    const count = await prisma.notification.count({
      where: {
        accountId,
        read: false,
      },
    });

    return ApiResponse.success(res, { count });
  } catch (error) {
    next(error);
  }
};

export const createDirectNotification = async (notificationData: {
  title: string;
  message: string;
  accountId: string;
  type: string;
}) => {
  try {
    const notification = await prisma.notification.create({
      data: notificationData,
    });

    return notification;
  } catch (error) {
    console.error('Error creating direct notification:', error);
    throw error;
  }
};

export default {
  getAllNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  createDirectNotification,
};
